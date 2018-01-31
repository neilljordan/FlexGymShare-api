const express = require('express');
const knex = require('../knex');
const bcrypt = require('bcrypt');

const router = express.Router();
const salt = bcrypt.genSaltSync(10);

router.get('/daypasses', (req, res, next) => {
  knex('daypass')
    .select('*')
    .column(knex.raw('(select pass_type.name from pass_type, daypass where pass_type.id = daypass.pass_type_id) as pass_name'))
    .orderBy('id')
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
    .select('*')
    .column(knex.raw('(select pass_type.name from pass_type, daypass where pass_type.id = daypass.pass_type_id) as pass_name'))
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
  knex('daypass')
    .select('*')
    .column(knex.raw('(select pass_type.name from pass_type, daypass where pass_type.id = daypass.pass_type_id) as pass_name'))
    .where('id', passId)
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
