const express = require('express');
const knex = require('../knex');

const router = express.Router();

router.get('/configs', (req, res) => {
  knex('config')
    .orderBy('id')
    .then((configs) => {
      res.json(configs);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/configs/:id', (req, res, next) => {
  const gym_id = req.params.id;
  knex('config')
    .where('gym_id', gym_id)
    .then((config) => {
      res.json(config);
    })
    .catch(err => next(err));
});

router.post('/configs', (req, res, next) => {
  const {
    gym_id,
    name,
    value,
  } = req.body;

  knex('config')
    .insert({
      gym_id,
      name,
      value,
    })
    .returning('*')
    .then((newconfig) => {
      res.json(newconfig[0]);
    })
    .catch(err => next(err));
});

router.patch('/configs/:id', (req, res, next) => {
  const configId = req.params.id;
  const {
    gym_id,
    name,
    value,
  } = req.body;

  const patchconfig = {};

  if (name) {
    patchconfig.name = name;
  }

  knex('config')
    .where('id', configId)
    .then((config) => {
      knex('config')
        .update(patchconfig)
        .where('id', configId)
        .returning('*')
        .then((newconfig) => {
          res.json(newconfig);
        })
        .catch(err => next(err));
    });
});

router.delete('/configs/:id', (req, res, next) => {
  const configId = req.params.id;

  knex('config')
    .then((config) => {
      knex('config')
        .del()
        .where('id', configId)
        .returning('*')
        .then((deletedconfig) => {
          res.json(deletedconfig);
        })
        .catch(err => next(err));
    });
});


module.exports = router;
