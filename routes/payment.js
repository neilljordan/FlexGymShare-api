const express = require('express');
const knex = require('../knex');

const router = express.Router();

const stripeSecretKey = 'sk_test_lfGo8iTH6oP0IErEDPTPWKtX';
const stripeClient = require('stripe')(stripeSecretKey);

// create a customer record in the DB and return the customer object
function createCustomerRecord(customer, userId) {
  return new Promise((resolve, reject) => {
    knex('customer')
      .insert({
        user_id: userId,
        customer_code: customer.id,
        customer_email: customer.email,
        card_code: customer.default_source,
        card_brand: customer.sources.data[0].brand,
        card_zip_code: customer.sources.data[0].address_zip,
        card_last4: customer.sources.data[0].last4,
        card_exp_month: customer.sources.data[0].exp_month,
        card_exp_year: customer.sources.data[0].exp_year,
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

// TODO: check the amount, link to the order
// create a charge record in the DB and return the result
function createChargeRecord(charge, userId) {
  return new Promise((resolve, reject) => {
    // stripe returns a UNIX epoch...convert to local date
    const chargeDate = new Date(0);
    chargeDate.setUTCSeconds(charge.created);
    knex('transaction')
      .insert({
        date: chargeDate,
        amount: (charge.amount / 100), // convert back to dollars and make negative
        transaction_type_id: 2, // creating a Used a Card credit type
        user_id: userId,
        order_id: null,
        charge_code: charge.id,
        description: charge.description,
        status: charge.status,
      })
      .returning('id')
      .then((rows) => {
        if (rows.length > 0) {
          resolve(rows);
        }
      })
      .catch(err => reject(Error(`Unable to create charge record: ${err}`)));
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
  } = req.body;

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
        stripeClient.charges.create({
          amount: cart_amount * 100, // convert to cents
          currency: 'usd',
          customer: rows[0].customer_code,
          description: `${cart_pass_type}: ${cart_date} at ${cart_gym.name}`,
          statement_descriptor: `Flex Pass: ${cart_date}`,
          metadata: { pass_type: cart_pass_type, pass_date: cart_date, gym_name: cart_gym.name },
        }).then((charge) => {
          return createChargeRecord(charge, user_id);
        }).then((chargeRows) => {
          res.json(chargeRows[0]);
        }).catch(err => next(err));
      // create the customer in Stripe and the DB
      } else {
        console.log('This is a new customer');
        stripeClient.customers.create({
          email: email,
          source: token_id,
        }).then((customer) => {
          return createCustomerRecord(customer, user_id);
        }).then((customer) => {
          return stripeClient.charges.create({
            amount: cart_amount * 100,
            currency: 'usd',
            customer: customer.id,
            description: `${cart_pass_type}: ${cart_date} at ${cart_gym.name}`,
            statement_descriptor: `Flex Pass: ${cart_date}`,
            metadata: { pass_type: cart_pass_type, pass_date: cart_date, gym_name: cart_gym.name },
          });
        }).then((charge) => {
          return createChargeRecord(charge, user_id);
        }).then((chargeRows) => {
          res.json(chargeRows[0]);
        }).catch(err => {
          res.status(500).json({ error: err.toString() });
        });
      }
    });
});

module.exports = router;
