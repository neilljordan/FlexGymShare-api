const express = require('express');
const knex = require('../knex');

const router = express.Router();

router.get('/orders', (req, res, next) => {
  knex('order')
    .leftJoin('pass_type', 'pass_type.id', 'order.pass_type_id')
    .leftJoin('user', 'user.id', 'order.user_id')
    .leftJoin('order_type', 'order_type.id', 'order.order_type_id')
    .select('order.*', 'pass_type.name as pass_name', 'user.first_name as user_first_name', 'user.last_name as user_last_name', 'user.email as user_email', 'order_type.name as order_type_name')
    .orderBy('order.id')
    .then((orders) => {
      res.json(orders);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/orders/user/:id', (req, res, next) => {
  const userId = req.params.id;
  knex('order')
    .leftJoin('pass_type', 'pass_type.id', 'order.pass_type_id')
    .leftJoin('user', 'user.id', 'order.user_id')
    .leftJoin('order_type', 'order_type.id', 'order.order_type_id')
    .select('order.*', 'pass_type.name as pass_name', 'user.first_name as user_first_name', 'user.last_name as user_last_name', 'user.email as user_email', 'order_type.name as order_type_name')
    .orderBy('order.id')
    .where('order.user_id', userId)
    .then((orders) => {
      res.json(orders);
    })
    .catch((err) => {
      next(err);
    });
});

// get orders for a particular gym
router.get('/orders/gym/:gym_id', (req, res, next) => {
  const gymId = req.params.gym_id;
  knex('order')
    .leftJoin('pass_type', 'pass_type.id', 'order.pass_type_id')
    .leftJoin('user', 'user.id', 'order.user_id')
    .leftJoin('order_type', 'order_type.id', 'order.order_type_id')
    .select('order.*', 'pass_type.name as pass_name', 'user.first_name as user_first_name', 'user.last_name as user_last_name', 'user.email as user_email', 'order_type.name as order_type_name')
    .orderBy('order.id')
    .where('order.gym_id', gymId)
    .then((rows) => {
      res.json(rows);
    })
    .catch(err => next(err));
});

router.get('/orders/:id', (req, res, next) => {
  const orderId = req.params.id;
  knex('order')
    .leftJoin('pass_type', 'pass_type.id', 'order.pass_type_id')
    .leftJoin('user', 'user.id', 'order.user_id')
    .leftJoin('order_type', 'order_type.id', 'order.order_type_id')
    .select('order.*', 'pass_type.name as pass_name', 'user.first_name as user_first_name', 'user.last_name as user_last_name', 'user.email as user_email', 'order_type.name as order_type_name')
    .orderBy('order.id')
    .where('order.id', orderId)
    .then((orders) => {
      res.json(orders[0]);
    })
    .catch(err => next(err));
});

router.post('/orders', (req, res, next) => {
  const {
    date,
    amount,
    user_id,
    gym_id,
    order_type_id,
    pass_type_id,
    linked_order_id,
    comment,
  } = req.body;

  knex('order')
    .insert({
      date,
      amount,
      user_id,
      gym_id,
      order_type_id,
      pass_type_id,
      linked_order_id,
      comment,
    })
    .returning('*')
    .then((orders) => {
      res.json(orders[0]);
    })
    .catch(err => next(err));
});

module.exports = router;
