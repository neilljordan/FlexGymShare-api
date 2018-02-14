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

// TODO: check the amount, link to the transaction
// create a charge record in the DB and return the result
function createChargeRecord(charge, userId) {
  return new Promise((resolve, reject) => {
    // stripe returns a UNIX epoch...convert to local date
    const chargeDate = new Date(0);
    chargeDate.setUTCSeconds(charge.created);
    knex('charge')
      .insert({
        date: chargeDate,
        amount: charge.amount,
        user_id: userId,
        transaction_id: null,
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
  const token = req.body.stripeToken; // Using Express
  const userId = 1;
  console.log(token);

  // see if there is already a customer record for the user
  knex('user')
    .select('customer.customer_code')
    .leftJoin('customer', 'customer.user_id', 'user.id')
    .where('user.id', userId)
    .then((rows) => {
      if (rows[0].customer_code) {
        console.log('This is already a customer');
        stripeClient.charges.create({
          amount: 1000,
          currency: 'usd',
          customer: rows[0].customer_code,
          description: 'Example charge',
          statement_descriptor: 'Flex Pass: 2/19/18',
          metadata: { order_id: 9809 },
        }).then((charge) => {
          return createChargeRecord(charge, userId);
        }).then((chargeRows) => {
          res.json(chargeRows[0]);
        }).catch(err => next(err));
      } else {
        console.log('This is a new customer');
        // create the customer in Stripe then the DB
        stripeClient.customers.create({
          email: 'paying.user@example.com',
          source: token.id,
        }).then((customer) => {
          return createCustomerRecord(customer, userId);
        }).then((customer) => {
          return stripeClient.charges.create({
            amount: 1000,
            currency: 'usd',
            customer: customer.id,
            description: 'Example charge',
            statement_descriptor: 'Flex Pass: 2/19/18',
            metadata: { order_id: 9809 },
          });
        }).then((charge) => {
          return createChargeRecord(charge, userId);
        }).then((chargeRows) => {
          res.json(chargeRows[0]);
        }).catch(err => next(err));
      }
    });
});

module.exports = router;
