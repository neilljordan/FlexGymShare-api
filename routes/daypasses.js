const express = require('express');
const knex = require('../knex');

const router = express.Router();

router.get('/daypasses', (req, res, next) => {
  knex.select('*')
    .from('daypass')
    .innerJoin('pass_type', 'pass_type.id', 'daypass.pass_type_id')
    .orderBy('daypass.id')
    .then((daypasses) => {
      res.json(daypasses);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/daypasses/user/:id', (req, res, next) => {
  const renterId = req.params.id;
  knex.select('*')
    .from('daypass')
    .innerJoin('pass_type', 'pass_type.id', 'daypass.pass_type_id')
    .where('user_id', renterId)
    .then((daypasses) => {
      res.json(daypasses);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/daypasses/:id', (req, res, next) => {
  const passId = req.params.id;
  knex.select('*')
    .from('daypass')
    .innerJoin('pass_type', 'pass_type.id', 'daypass.pass_type_id')
    .where('daypass.id', passId)
    .then((daypass) => {
      res.json(daypass);
    })
    .catch(err => next(err));
});

router.post('/daypasses', (req, res, next) => {
  const { gym_id, user_id, date, pass_type_id } = req.body;
  knex('daypass')
    .insert({
      gym_id,
      user_id,
      date,
      pass_type_id,
    })
    .returning('*')
    .then((daypass) => {
      res.json(daypass);
    })
    .catch(err => next(err));
});

router.delete('/daypasses/:id', (req, res, next) => {
  const passId = req.params.id;
  knex('daypass')
    .then((dates) => {
      knex('daypass')
        .del()
        .where('id', passId)
        .returning('*')
        .then((date) => {
          res.json(date[0]);
        })
        .catch(err => next(err));
    });
});

module.exports = router;
