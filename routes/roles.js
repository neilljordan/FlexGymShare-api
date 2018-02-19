const express = require('express');
const knex = require('../knex');

const router = express.Router();

router.get('/roles', (req, res, next) => {
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

router.get('/roles/gym/:gym_id/user/:user_id', (req, res, next) => {
  const gymId = req.params.gym_id;
  const userId = req.params.user_id;

  knex('gym_staff')
    .first('role.name')
    .innerJoin('role', 'gym_staff.role_id', 'role.id')
    .where('gym_staff.gym_id', gymId)
    .andWhere('user_id', userId)
    .on('query', data => console.log(data))
    .then((rows) => {
      res.json(rows);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
