const express = require('express');
const knex = require('../knex');
const bcrypt = require('bcrypt');

const router = express.Router();
const salt = bcrypt.genSaltSync(10);

router.get('/daypasses', (req, res, next) => {
  knex('daypass')
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
    .where('id', passId)
    .then((daypass) => {
      res.json(daypass);
    })
    .catch(err => next(err));
});

router.post('/daypasses', (req, res, next) => {
  const { gymId, userId, date } = req.body;
  knex('daypass')
    .insert({
      gymId,
      userId,
      date,
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
