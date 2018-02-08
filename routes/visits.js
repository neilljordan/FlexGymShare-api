const express = require('express');
const knex = require('../knex');

const router = express.Router();

router.get('/visits', (req, res) => {
  knex('visit')
    .orderBy('id')
    .then((visits) => {
      res.json(visits);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/visits/:id', (req, res, next) => {
  const visitId = req.params.id;
  knex('visit')
    .where('id', visitId)
    .then((visit) => {
      res.json(visit);
    })
    .catch(err => next(err));
});

// get visits for a particular gym
router.get('/visits/gym/:gym_id', (req, res, next) => {
  const gymId = req.params.gym_id;
  knex('visit')
    .where('gym_id', gymId)
    .then((rows) => {
      res.json(rows);
    })
    .catch(err => next(err));
});

router.post('/visits', (req, res, next) => {
  const {
    renter_id,
    worker_id,
    gym_id,
    pass_type,
    date,
    notes,
  } = req.body;

  knex('visit')
    .insert({
      renter_id,
      worker_id,
      gym_id,
      pass_type,
      date,
      notes,
    })
    .returning('*')
    .then((newvisit) => {
      res.json(newvisit[0]);
    })
    .catch(err => next(err));
});

router.patch('/visits/:id', (req, res, next) => {
  const visitId = req.params.id;
  const {
    name,
  } = req.body;

  const patchvisit = {};

  if (name) {
    patchvisit.name = name;
  }

  knex('visit')
    .where('id', visitId)
    .then((visit) => {
      knex('visit')
        .update(patchvisit)
        .where('id', visitId)
        .returning('*')
        .then((newvisit) => {
          res.json(newvisit);
        })
        .catch(err => next(err));
    });
});

router.delete('/visits/:id', (req, res, next) => {
  const visitId = req.params.id;

  knex('visit')
    .then((visit) => {
      knex('visit')
        .del()
        .where('id', visitId)
        .returning('*')
        .then((deletedvisit) => {
          res.json(deletedvisit);
        })
        .catch(err => next(err));
    });
});


module.exports = router;
