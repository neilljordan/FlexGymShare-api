const express = require('express');
const knex = require('../knex');
const qr = require('qr-image');

const router = express.Router();

router.get('/staff', (req, res) => {
  knex('gym_staff')
    .orderBy('id')
    .then((gymStaff) => {
      res.json(gymStaff);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/staff/gym/:gym_id', (req, res, next) => {
 //  select * from gym_staff INNER JOIN role ON role.id = gym_staff.role_id
 // where gym_id = 4
  const gymId = req.params.gym_id
  knex('gym_staff')
    .join('role', 'gym_staff.role_id', '=', 'role.id')
    .join('user', 'gym_staff.user_id', '=', 'user.id')
    .where('gym_staff.gym_id', gymId)
    .then((staff) => {
      console.log(staff)
      res.json(staff)
    })
    .catch(err => next(err));
})

router.get('/staff/:id', (req, res, next) => {
  const staffId = req.params.id;
  knex('gym_staff')
    .where('id', staffId)
    .then((staff) => {
      res.json(staff);
    })
    .catch(err => next(err));
});

router.post('/staff', (req, res, next) => {
  const {
    gym_id, user_id, role_id,
  } = req.body;

  knex('gym_staff')
    .insert({
      gym_id,
      user_id,
      role_id,
    })
    .returning('*')
    .then((newStaff) => {
      res.json(newStaff[0]);
    })
    .catch(err => next(err));
});

router.patch('/staff/:id', (req, res, next) => {
  const staffId = req.params.id;
  const {
    gym_id, user_id, role_id
  } = req.body;

  const patchStaff = {};

  if (gym_id) {
    patchStaff.gym_id = gym_id;
  }
  if (user_id) {
    patchStaff.user_id = user_id;
  }
  if (role_id) {
    patchStaff.role_id = role_id;
  }

  knex('gym_staff')
    .where('id', staffId)
    .then((staff) => {
      knex('gym_staff')
        .update(patchStaff)
        .where('id', staffId)
        .returning('*')
        .then((newStaff) => {
          res.json(newStaff);
        })
        .catch(err => next(err));
    });
});

router.delete('/staff/:id', (req, res, next) => {
  const staffId = req.params.id;

  knex('gym_staff')
    .then((staff) => {
      knex('gym_staff')
        .del()
        .where('id', staffId)
        .returning('*')
        .then((deletedStaff) => {
          res.json(deletedStaff);
        })
        .catch(err => next(err));
    });
});


module.exports = router;
