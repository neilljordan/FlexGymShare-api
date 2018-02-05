const express = require('express');
const knex = require('../knex');
const qr = require('qr-image');

const router = express.Router();

router.get('/roles', (req, res) => {
  knex('role')
    .orderBy('id')
    .then((roles) => {
      res.json(roles);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/roles/:id', (req, res, next) => {
  const roleId = req.params.id;
  knex('role')
    .where('id', roleId)
    .then((role) => {
      res.json(role);
    })
    .catch(err => next(err));
});

router.post('/roles', (req, res, next) => {
  const {
    name
  } = req.body;

  knex('role')
    .insert({
      name,
    })
    .returning('*')
    .then((newRole) => {
      res.json(newRole[0]);
    })
    .catch(err => next(err));
});

router.patch('/roles/:id', (req, res, next) => {
  const roleId = req.params.id;
  const {
    name,
  } = req.body;

  const patchRole = {};

  if (name) {
    patchRole.name = name;
  }

  knex('role')
    .where('id', roleId)
    .then((role) => {
      knex('role')
        .update(patchRole)
        .where('id', roleId)
        .returning('*')
        .then((newRole) => {
          res.json(newRole);
        })
        .catch(err => next(err));
    });
});

router.delete('/roles/:id', (req, res, next) => {
  const roleId = req.params.id;

  knex('role')
    .then((role) => {
      knex('role')
        .del()
        .where('id', roleId)
        .returning('*')
        .then((deletedRole) => {
          res.json(deletedRole);
        })
        .catch(err => next(err));
    });
});


module.exports = router;