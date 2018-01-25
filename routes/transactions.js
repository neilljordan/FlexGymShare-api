const express = require('express');
const knex = require('../knex');
const bcrypt = require('bcrypt');

const router = express.Router();
const salt = bcrypt.genSaltSync(10);

router.get('/transactions', (req, res, next) => {
  knex('transaction')
    .orderBy('id')
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
    .orderBy('id')
    .where('user_id', userId)
    .then((transactions) => {
      res.json(transactions);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/transactions/:id', (req, res, next) => {
  const transactionId = req.params.id;
  knex('transaction')
    .where('id', transactionId)
    .then((transactions) => {
      res.json(transactions[0]);
    })
    .catch(err => next(err));
});

router.post('/transactions', (req, res, next) => {
  const {
    gym_date, user_id, listing_id, hash, gym_id, currentTime,
  } = req.body;
  const pass = currentTime + gym_date + user_id + listing_id + gym_id;
  knex('transaction')
    .insert({
      gym_date,
      user_id,
      listing_id,
      hash: bcrypt.hashSync(pass, salt),
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
  const { user_id, listing_id, hash } = req.body;
  const patchTransaction = {};

  if (user_id) {
    patchTransaction.user_id = user_id;
  }
  if (listing_id) {
    patchTransaction.listing_id = listing_id;
  }
  if (hash) {
    patchTransaction.hash = hash;
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
