const express = require('express');
const knex = require('../knex');

const router = express.Router();

const stripeSecretKey = 'sk_test_lfGo8iTH6oP0IErEDPTPWKtX';
const stripeClient = require('stripe')(stripeSecretKey);

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
        resolve(rows);
      })
      .catch(err => reject(Error(`Unable to create customer record: ${err}`)));
  });
}

router.post('/payment', (req, res, next) => {
  const token = req.body.stripeToken; // Using Express
  const userId = 1;
  console.log(token);

  stripeClient.customers.create({
    email: 'paying.user@example.com',
    source: token.id,
  }).then((customer) => {
    createCustomerRecord(customer, userId);
    return stripeClient.charges.create({
      amount: 1000,
      currency: 'usd',
      customer: customer.id,
      description: 'Example charge',
      statement_descriptor: 'Flex Pass: 2/19/18',
      metadata: { order_id: 9809 },
    });
  }).then((charge) => {
    console.log(charge.id);
    console.log(charge.amount);
    console.log(charge.created);
    console.log(charge.customer);
    console.log(charge.description);
    console.log(charge.statement_descriptor);
    console.log(charge.status);
    console.log(charge.paid);
  });
});

module.exports = router;
