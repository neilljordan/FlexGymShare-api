const express = require('express');
const knex = require('../knex');
const crypto = require('crypto');

const router = express.Router();

router.get('/transactions', (req, res, next) => {
  knex('transaction')
    .join('pass_type', 'pass_type.id', '=', 'transaction.pass_type_id')
    .select('transaction.code', 'transaction.id', 'pass_type.id', 'transaction.user_id', 'transaction.pass_date', 'pass_type.name', 'transaction.listing_id', 'transaction.gym_id')
    .then((transactions) => {
      res.json(transactions);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/transactions/user/:id', (req, res, next) => {
  const userId = req.params.id;
  knex('transaction')
    .join('pass_type', 'pass_type.id', '=', 'transaction.pass_type_id')
    .select('transaction.code', 'transaction.id', 'pass_type.id', 'transaction.user_id', 'transaction.pass_date', 'pass_type.name', 'transaction.listing_id', 'transaction.gym_id')
    .where('user_id', userId)
    .then((transactions) => {
      res.json(transactions);
    })
    .catch((err) => {
      next(err);
    });
});

// get transactions for a particular gym
router.get('/transactions/gym/:gym_id', (req, res, next) => {
  const gymId = req.params.gym_id;
  knex('transaction')
    .where('gym_id', gymId)
    .then((rows) => {
      res.json(rows);
    })
    .catch(err => next(err));
});

router.get('/transactions/:id', (req, res, next) => {
  const transactionId = req.params.id;
  knex.select('*')
    .from('transaction')
    .innerJoin('pass_type', 'pass_type.id', 'transaction.pass_type_id')
    .orderBy('transaction.id')
    .where('transaction.id', transactionId)
    .then((transactions) => {
      res.json(transactions[0]);
    })
    .catch(err => next(err));
});

router.post('/transactions', (req, res, next) => {
  const {
    pass_date, pass_type_id, user_id, listing_id, gym_id,
  } = req.body;

  knex('transaction')
    .insert({
      pass_date,
      user_id,
      listing_id,
      pass_type_id,
      code: crypto.randomBytes(20).toString('hex'),
      gym_id,
    })
    .returning('*')
    .then((transactions) => {
      res.json(transactions[0]);
    })
    .catch(err => next(err));
});

router.patch('/transactions/:id', (req, res, next) => {
  const transactionId = req.params.id;
  const {
    user_id, listing_id, pass_type_id, code
  } = req.body;
  const patchTransaction = {};

  if (user_id) {
    patchTransaction.user_id = user_id;
  }
  if (listing_id) {
    patchTransaction.listing_id = listing_id;
  }
  if (code) {
    patchTransaction.code = code;
  }

  knex('transaction')
    .where('id', transactionId)
    .then((transactions) => {
      knex('transaction')
        .update(patchTransaction)
        .where('id', transactionId)
        .returning('*')
        .then((newTransaction) => {
          res.json(newTransaction);
        })
        .catch(err => next(err));
    });
});

router.delete('/transactions/:id', (req, res, next) => {
  const transactionId = req.params.id;
  knex('transaction')
    .then((transactions) => {
      knex('transaction')
        .del()
        .where('id', transactionId)
        .returning('*')
        .then((deletedTransaction) => {
          res.json(deletedTransaction);
        })
        .catch(err => next(err));
    });
});

module.exports = router;
