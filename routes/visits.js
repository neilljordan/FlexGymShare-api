const express = require('express');
const knex = require('../knex');

const router = express.Router();

router.get('/visits', (req, res, next) => {
  knex('visit')
    .orderBy('id')
    .then((visits) => {
      res.json(visits);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/visits/pass/:pass_id', (req, res, next) => {
  const passId = req.params.pass_id;
  knex('visit')
    .where('pass_id', passId)
    .then((visit) => {
      if (visit) {
        res.json(visit);
      }
      res.send(JSON.stringify(false));
    })
    .catch(err => next(err));
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

// [{"id":4,"renter_id":1,"worker_id":4,"gym_id":null,"pass_id":1,"date":"2018-01-30T07:00:00.000Z","notes":"Rover is a good boy. A very good boy.","created_at":"2018-02-09T18:15:30.701Z","updated_at":"2018-02-09T18:15:30.701Z","facebook_uid":"","email":"test+4@youflex.co","first_name":"Worker","last_name":"User4","profile_image":""}]

// get visits for a particular gym
router.get('/visits/gym/:gym_id', (req, res, next) => {
  const gymId = req.params.gym_id;
  knex('visit')
    .select('visit.id', 'visit.created_at', 'visit.date', 'visit.notes', 'renter_table.first_name', 'renter_table.last_name', 'renter_table.email', 'worker_table.first_name as worker_first_name', 'worker_table.last_name as worker_last_name', 'worker_table.email as worker_email')
    .innerJoin('user as worker_table', 'worker_id', 'worker_table.id')
    .innerJoin('user as renter_table', 'renter_id', 'renter_table.id')
    .where('visit.gym_id', gymId)
    .then((rows) => {
      res.json(rows);
    })
    .catch(err => next(err));
});

router.post('/visits', (req, res, next) => {
  const {
    pass_id,
    renter_id,
    worker_id,
    gym_id,
    date,
    notes,
  } = req.body;

  knex('visit')
    .insert({
      pass_id,
      renter_id,
      worker_id,
      gym_id,
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
