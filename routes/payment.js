const express = require('express');
const knex = require('../knex');

const router = express.Router();

const stripeSecretKey = 'sk_test_lfGo8iTH6oP0IErEDPTPWKtX';

router.post('/payment', (req, res, next) => {
  const {
    token,
  } = req.body;

  console.log(token);
});

module.exports = router;
