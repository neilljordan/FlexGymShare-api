const express = require('express');
const knex = require('../knex');
const crypto = require('crypto');

const router = express.Router();

router.get('/daypasses', (req, res, next) => {
  knex('daypass')
    .select('daypass.*', 'pass_type.name as pass_name', 'gym.name as gym_name', 'user.first_name', 'user.last_name', 'user.email', 'user.profile_image')
    .innerJoin('pass_type', 'pass_type.id', 'daypass.pass_type_id')
    .innerJoin('user', 'daypass.user_id', 'user.id')
    .innerJoin('gym', 'daypass.gym_id', 'gym.id')
    .then((daypasses) => {
      res.json(daypasses);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/daypasses/user/:id', (req, res, next) => {
  const renterId = req.params.id;
  knex('daypass')
    .select('daypass.*', 'pass_type.name as pass_name', 'gym.name as gym_name', 'user.first_name', 'user.last_name', 'user.email', 'user.profile_image')
    .innerJoin('pass_type', 'pass_type.id', 'daypass.pass_type_id')
    .innerJoin('user', 'daypass.user_id', 'user.id')
    .innerJoin('gym', 'daypass.gym_id', 'gym.id')
    .where('daypass.user_id', renterId)
    .then((daypasses) => {
      res.json(daypasses);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/daypasses/gym/:id', (req, res, next) => {
  const gymId = req.params.id;
  knex('daypass')
    .select('daypass.*', 'pass_type.name as pass_name', 'gym.name as gym_name', 'user.first_name', 'user.last_name', 'user.email', 'user.profile_image')
    .innerJoin('pass_type', 'pass_type.id', 'daypass.pass_type_id')
    .innerJoin('user', 'daypass.user_id', 'user.id')
    .innerJoin('gym', 'daypass.gym_id', 'gym.id')
    .where('daypass.gym_id', gymId)
    .orderBy('daypass.date')
    .then((daypasses) => {
      res.json(daypasses);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/daypasses/:id', (req, res, next) => {
  const passId = req.params.id;
  knex('daypass')
    .select('daypass.*', 'pass_type.name as pass_name', 'gym.name as gym_name', 'user.first_name', 'user.last_name', 'user.email', 'user.profile_image')
    .innerJoin('pass_type', 'pass_type.id', 'daypass.pass_type_id')
    .innerJoin('user', 'daypass.user_id', 'user.id')
    .innerJoin('gym', 'daypass.gym_id', 'gym.id')
    .where('daypass.id', passId)
    .then((daypass) => {
      res.json(daypass);
    })
    .catch(err => next(err));
});

router.post('/daypasses', (req, res, next) => {
  const {
    user_id,
    gym_id,
    pass_type_id,
    order_id,
    date,
  } = req.body;
  knex('daypass')
    .insert({
      user_id,
      gym_id,
      pass_type_id,
      order_id,
      date,
      code: crypto.randomBytes(10).toString('hex'),
    })
    .returning('*')
    .then((daypass) => {
      res.json(daypass);
    })
    .catch(err => next(err));
});

module.exports = router;
