const express = require('express');
const knex = require('../knex');

const router = express.Router();

const stripeSecretKey = 'sk_test_lfGo8iTH6oP0IErEDPTPWKtX';
const stripeClient = require('stripe')(stripeSecretKey);

// update customer payment
function updateCustomerPayment(token_id, user_id, card_info) {
  console.log(`update payment for: ${user_id}`);
  console.log(`token_id: ${token_id}`);
  console.log(`card info: ${card_info}`);

  const cardZip = card_info.address_zip;
  const cardLast4 = card_info.last4;
  const cardExpMonth = card_info.exp_month;
  const cardExpYear = card_info.exp_year;
  // Could not pull this from card_info from token on UI
  // const cardCode = card_info.default_source;
  const cardBrand = card_info.brand;

  const patchCustomer = {
    card_brand: cardBrand,
    card_zip_code: cardZip,
    card_last4: cardLast4,
    card_exp_month: cardExpMonth,
    card_exp_year: cardExpYear,
  };

  knex('customer')
    .update(patchCustomer)
    .where('user_id', user_id)
    .returning('*')
    .then((updatedCustomer) => {
      console.log(updatedCustomer);
    });
}

// create a customer record in the DB and return the customer object
function createCustomerRecord(customer, userId) {
  return new Promise((resolve, reject) => {
    knex('customer')
      .insert({
        user_id: userId,
        customer_code: customer.id,
        customer_email: customer.email,
      })
      .returning('id')
      .then((rows) => {
        if (rows.length > 0) {
          resolve(customer);
        }
      })
      .catch(err => reject(Error(`Unable to create customer record: ${err}`)));
  });
}

// create an order (debit) transaction record in the DB and return the result
function createOrderTransaction(charge, userId, orderId) {
  return new Promise((resolve, reject) => {
    // stripe returns a UNIX epoch...convert to local date
    const chargeDate = new Date(0);
    chargeDate.setUTCSeconds(charge.created);
    knex('transaction')
      .insert({
        amount: -(charge.amount / 100), // convert back to dollars and make negative
        transaction_type_id: 1, // creating a Bought a Pass
        user_id: userId,
        order_id: orderId,
        charge_code: null,
        description: `Bought ${charge.description}`,
        status: 'purchased',
      })
      .returning('id')
      .then((rows) => {
        if (rows.length > 0) {
          resolve(charge);
        }
      })
      .catch(err => reject(Error(`Unable to create order transaction record: ${err}`)));
  });
}

// create a charge (credit) transaction record in the DB and return the result
function createChargeTransaction(charge, userId, orderId) {
  return new Promise((resolve, reject) => {
    // stripe returns a UNIX epoch...convert to local date
    const chargeDate = new Date(0);
    chargeDate.setUTCSeconds(charge.created);
    knex('transaction')
      .insert({
        amount: (charge.amount / 100), // convert back to dollars and make negative
        transaction_type_id: 2, // creating a Used a Card credit type
        user_id: userId,
        order_id: orderId,
        charge_code: charge.id,
        description: `Used card for ${charge.description}`,
        status: charge.status,
      })
      .returning('id')
      .then((rows) => {
        if (rows.length > 0) {
          resolve(rows);
        }
      })
      .catch(err => reject(Error(`Unable to create charge transaction record: ${err}`)));
  });
}

// create an account balance (credit) transaction record in the DB and return the result
function createBalanceTransaction(userId, orderId, cartAmount, applyCredit) {
  return new Promise((resolve, reject) => {
    if (!applyCredit) {
      resolve(cartAmount);
    } else {
      knex('transaction')
        .sum('amount')
        .where('user_id', userId)
        .then(rows => parseFloat(rows[0].sum).toFixed(2))
        .then((availableBalance) => {
          // if there is more on the account than the price then pay the whole price
          const appliedBalance = (availableBalance > cartAmount) ? cartAmount : availableBalance;
          const date = new Date();
          knex('transaction')
            .insert({
              amount: -appliedBalance, // convert back to dollars and make negative
              transaction_type_id: 3, // creating a Used Credit credit type
              user_id: userId,
              order_id: orderId,
              charge_code: null,
              description: 'Applied balance towards Flex Pass purchase',
              status: 'applied',
            })
            .returning('id')
            .then((rows) => {
              if (rows.length > 0) {
                resolve(cartAmount - appliedBalance);
              }
            })
            .catch(err => reject(Error(`Unable to create charge transaction record: ${err}`)));
        });
    }
  });
}

// handle the POST request when a user completes a purchase
router.post('/payment', (req, res, next) => {
  const {
    user_id,
    email,
    first_name,
    last_name,
    token_id,
    cart_gym,
    cart_date,
    cart_pass_type,
    cart_amount,
    order_id,
    apply_credit,
  } = req.body;

  const cartAmount = parseFloat(cart_amount);
  // see if there is already a customer record for the user
  knex('user')
    .select('customer.customer_code')
    .leftJoin('customer', 'customer.user_id', 'user.id')
    .where('user.id', user_id)
    .then((rows) => {
      // make sure the user actually exists and otherwise send an error
      if (!rows.length) {
        res.status(500).json({ error: 'Not a valid user' });
      }
      // check to see if it's an existing customer
      if (rows[0].customer_code) {
        console.log('This is already a customer');
        createBalanceTransaction(user_id, order_id, cartAmount, apply_credit)
          .then((chargeAmount) => {
            stripeClient.charges.create({
              amount: chargeAmount * 100, // convert to cents
              currency: 'usd',
              customer: rows[0].customer_code,
              description: `${cart_pass_type} for ${cart_date} at ${cart_gym.name}`,
              statement_descriptor: `Flex Pass: ${cart_date}`,
              metadata: { pass_type: cart_pass_type, pass_date: cart_date, gym_name: cart_gym.name },
            })
              .then(charge => createOrderTransaction(charge, user_id, order_id))
              .then(charge => createChargeTransaction(charge, user_id, order_id))
              .then((transactionRows) => {
                console.log(transactionRows);
                res.json(transactionRows[0]);
              })
              .catch((err) => {
                res.status(500).json({ error: err.toString() });
              });
          });
      // create the customer in Stripe and the DB
      } else {
        console.log('This is a new customer');
        createBalanceTransaction(user_id, order_id, cartAmount, apply_credit)
          .then((chargeAmount) => {
            stripeClient.customers.create({
              email,
              source: token_id,
            }).then(customer => createCustomerRecord(customer, user_id))
              .then(customer => stripeClient.charges.create({
                amount: chargeAmount * 100,
                currency: 'usd',
                customer: customer.id,
                description: `${cart_pass_type}: ${cart_date} at ${cart_gym.name}`,
                statement_descriptor: `Flex Pass: ${cart_date}`,
                metadata: { pass_type: cart_pass_type, pass_date: cart_date, gym_name: cart_gym.name },
              }))
              .then(charge => createOrderTransaction(charge, user_id, order_id))
              .then(charge => createChargeTransaction(charge, user_id, order_id))
              .then((transactionRows) => {
                res.json(transactionRows[0]);
              })
              .catch((err) => {
                res.status(500).json({ error: err.toString() });
              });
          });
      }
    });
});

// New API route
// /payment/method
// GET (/payment/method/:user_id
// card_brand
// card_last4
// card_exp_month
// card_exp_year

router.get('/payment/get/:user_id', (req, res, next) => {
  const { user_id } = req.params;
  knex('customer')
    .select('card_brand', 'card_last4', 'card_exp_month', 'card_exp_year')
    .where('user_id', user_id)
    .then((customer) => {
      console.log(customer);
      res.json(customer);
    });
});

// POST (/payment/method)
// user_id (to match the customer record)
// card_code
// card_brand
// card_zip_code
// card_last4
// card_exp_month
// card_exp_year

router.post('/payment/post/:user_id', (req, res, next) => {
  const { user_id } = req.params;
  const {
    card_code,
    card_brand,
    card_zip_code,
    card_last4,
    card_exp_month,
    card_exp_year,
  } = req.body;

  const customerPatch = {
    card_code,
    card_brand,
    card_zip_code,
    card_last4,
    card_exp_month,
    card_exp_year,
  };

  knex('customer')
    .update(customerPatch)
    .where('user_id', user_id)
    .returning('*')
    .then((updatedCustomer) => {
      console.log(updatedCustomer);
      res.send(updatedCustomer);
    });
});

module.exports = router;
