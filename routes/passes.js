const express = require('express');
const knex = require('../knex');
const crypto = require('crypto');

const router = express.Router();

router.get('/passes', (req, res, next) => {
  knex('pass')
    .select('pass.*', 'pass_type.name as pass_name', 'gym.name as gym_name', 'user.first_name', 'user.last_name', 'user.email', 'user.profile_image')
    .innerJoin('pass_type', 'pass_type.id', 'pass.pass_type_id')
    .innerJoin('user', 'pass.user_id', 'user.id')
    .innerJoin('gym', 'pass.gym_id', 'gym.id')
    .then((passes) => {
      res.json(passes);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/passes/user/:id', (req, res, next) => {
  const renterId = req.params.id;
  knex('pass')
    .select('pass.*', 'pass_type.name as pass_name', 'gym.name as gym_name', 'user.first_name', 'user.last_name', 'user.email', 'user.profile_image')
    .innerJoin('pass_type', 'pass_type.id', 'pass.pass_type_id')
    .innerJoin('user', 'pass.user_id', 'user.id')
    .innerJoin('gym', 'pass.gym_id', 'gym.id')
    .where('pass.user_id', renterId)
    .then((passes) => {
      res.json(passes);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/passes/gym/:id', (req, res, next) => {
  const gymId = req.params.id;
  knex('pass')
    .select('pass.*', 'pass_type.name as pass_name', 'gym.name as gym_name', 'user.first_name', 'user.last_name', 'user.email', 'user.profile_image')
    .innerJoin('pass_type', 'pass_type.id', 'pass.pass_type_id')
    .innerJoin('user', 'pass.user_id', 'user.id')
    .innerJoin('gym', 'pass.gym_id', 'gym.id')
    .where('pass.gym_id', gymId)
    .orderBy('pass.date')
    .then((passes) => {
      res.json(passes);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/passes/:id', (req, res, next) => {
  const passId = req.params.id;
  knex('pass')
    .select('pass.*', 'pass_type.name as pass_name', 'gym.name as gym_name', 'user.first_name', 'user.last_name', 'user.email', 'user.profile_image')
    .innerJoin('pass_type', 'pass_type.id', 'pass.pass_type_id')
    .innerJoin('user', 'pass.user_id', 'user.id')
    .innerJoin('gym', 'pass.gym_id', 'gym.id')
    .where('pass.id', passId)
    .then((pass) => {
      res.json(pass);
    })
    .catch(err => next(err));
});

router.post('/passes', (req, res, next) => {
  const {
    user_id,
    gym_id,
    pass_type_id,
    order_id,
    date,
  } = req.body;
  knex('pass')
    .insert({
      user_id,
      gym_id,
      pass_type_id,
      order_id,
      date,
      code: crypto.randomBytes(10).toString('hex'),
    })
    .returning('*')
    .then((pass) => {
      res.json(pass);
    })
    .catch(err => next(err));
});

module.exports = router;
