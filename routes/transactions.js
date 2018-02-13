const express = require('express');
const knex = require('../knex');

const router = express.Router();

router.get('/transactions', (req, res, next) => {
  knex('transaction')
    .leftJoin('pass_type', 'pass_type.id', 'transaction.pass_type_id')
    .leftJoin('user', 'user.id', 'transaction.user_id')
    .leftJoin('transaction_type', 'transaction_type.id', 'transaction.transaction_type_id')
    .select('transaction.*', 'pass_type.name as pass_name', 'user.first_name as user_first_name', 'user.last_name as user_last_name', 'user.email as user_email', 'transaction_type.name as transaction_type_name')
    .orderBy('transaction.id')
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
    .leftJoin('pass_type', 'pass_type.id', 'transaction.pass_type_id')
    .leftJoin('user', 'user.id', 'transaction.user_id')
    .leftJoin('transaction_type', 'transaction_type.id', 'transaction.transaction_type_id')
    .select('transaction.*', 'pass_type.name as pass_name', 'user.first_name as user_first_name', 'user.last_name as user_last_name', 'user.email as user_email', 'transaction_type.name as transaction_type_name')
    .orderBy('transaction.id')
    .where('transaction.user_id', userId)
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
    .leftJoin('pass_type', 'pass_type.id', 'transaction.pass_type_id')
    .leftJoin('user', 'user.id', 'transaction.user_id')
    .leftJoin('transaction_type', 'transaction_type.id', 'transaction.transaction_type_id')
    .select('transaction.*', 'pass_type.name as pass_name', 'user.first_name as user_first_name', 'user.last_name as user_last_name', 'user.email as user_email', 'transaction_type.name as transaction_type_name')
    .orderBy('transaction.id')
    .where('transaction.gym_id', gymId)
    .then((rows) => {
      res.json(rows);
    })
    .catch(err => next(err));
});

router.get('/transactions/:id', (req, res, next) => {
  const transactionId = req.params.id;
  knex('transaction')
    .leftJoin('pass_type', 'pass_type.id', 'transaction.pass_type_id')
    .leftJoin('user', 'user.id', 'transaction.user_id')
    .leftJoin('transaction_type', 'transaction_type.id', 'transaction.transaction_type_id')
    .select('transaction.*', 'pass_type.name as pass_name', 'user.first_name as user_first_name', 'user.last_name as user_last_name', 'user.email as user_email', 'transaction_type.name as transaction_type_name')
    .orderBy('transaction.id')
    .where('transaction.id', transactionId)
    .then((transactions) => {
      res.json(transactions[0]);
    })
    .catch(err => next(err));
});

router.post('/transactions', (req, res, next) => {
  const {
    date,
    amount,
    user_id,
    gym_id,
    transaction_type_id,
    pass_type_id,
    linked_transaction_id,
    comment,
  } = req.body;

  knex('transaction')
    .insert({
      date,
      amount,
      user_id,
      gym_id,
      transaction_type_id,
      pass_type_id,
      linked_transaction_id,
      comment,
    })
    .returning('*')
    .then((transactions) => {
      res.json(transactions[0]);
    })
    .catch(err => next(err));
});

module.exports = router;
