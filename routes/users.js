const express = require('express');
const knex = require('../knex');

const router = express.Router();

// get all users
router.get('/users', (req, res, next) => {
  knex('user')
    .select('user.*')
    .sum('transaction.amount as account_balance')
    .leftJoin('transaction', 'transaction.user_id', 'user.id')
    .groupBy('user.id')
    .orderBy('user.id')
    .then((rows) => {
      res.json(rows);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

// get user by integer id
router.get('/users/:id', (req, res, next) => {
  const userId = req.params.id;
  knex('user')
    .first('user.*')
    .sum('transaction.amount as account_balance')
    .leftJoin('transaction', 'transaction.user_id', 'user.id')
    .groupBy('user.id')
    .orderBy('user.id')
    .where('user.id', userId)
    .then((rows) => {
      if (rows) {
        res.json(rows);
      } else {
        res.send(JSON.stringify(false));
      }
    })
    .catch(err => next(err));
});

// get user by facebook_uid
router.get('/users/uid/:uid', (req, res, next) => {
  const fbId = req.params.uid;
  knex('user')
    .first('user.*')
    .sum('transaction.amount as account_balance')
    .leftJoin('transaction', 'transaction.user_id', 'user.id')
    .groupBy('user.id')
    .orderBy('user.id')
    .where('facebook_uid', fbId)
    .then((rows) => {
      if (rows) {
        res.json(rows);
      } else {
        res.send(JSON.stringify(false));
      }
    })
    .catch(err => next(err));
});

// get user by email
router.get('/users/email/:email', (req, res, next) => {
  const userEmail = req.params.email;
  knex('user')
    .first('user.*')
    .sum('transaction.amount as account_balance')
    .leftJoin('transaction', 'transaction.user_id', 'user.id')
    .groupBy('user.id')
    .orderBy('user.id')
    .where('email', userEmail)
    .then((rows) => {
      if (rows) {
        res.json(rows);
      } else {
        res.send(JSON.stringify(false));
      }
    })
    .catch(err => next(err));
});

router.get('/users/roles/:gym_id/:user_id', (req, res, next) => {
  const {
    user_id, gym_id,
  } = req.params;

  knex('gym_staff')
    .join('role', 'gym_staff.role_id', '=', 'role.id')
    .where('user_id', user_id)
    .then((gymStaff) => {
      res.send(gymStaff);
      // if (gymStaff) {
      //   return knex('role')
      //     .select('*')
      //     .column(knex.raw('(select array(select gym_id from gym_staff where gym_staff.user_id = gym.id) as blackout_dates)'))
      //     .where('id', gymStaff.role_id)
      //     .first()
      //     .then((roles) => {
      //       res.send(roles)
      //     })
      // }
      // res.send(JSON.stringify(false))
    })
    .catch(err => next(err));
});

// create a new user
router.post('/users', (req, res, next) => {
  const {
    first_name, last_name, email, profile_image, facebook_uid,
  } = req.body;

  knex('user')
    .insert({
      first_name,
      last_name,
      email,
      facebook_uid,
      profile_image,
    })
    .returning('*')
    .then((users) => {
      res.json(users[0]);
    })
    .catch(err => next(err));
});

// partial update of a user
router.patch('/users/:id', (req, res, next) => {
  const userId = req.params.id;
  const {
    first_name, last_name, email, gymId, membershipCode
  } = req.body;
  
  let patchUser = {};

  if (first_name) {
    patchUser.first_name = first_name;
  }
  if (last_name) {
    patchUser.last_name = last_name;
  }
  if (email) {
    patchUser.email = email;
  }
  if (gymId) {
    patchUser.gym_id = gymId;
  }
  if (membershipCode) {
    patchUser.gym_membership_code = membershipCode;
  }

  knex('user')
    .where('id', userId)
    .then((users) => {
      knex('user')
        .update(patchUser)
        .where('id', userId)
        .returning('*')
        .then((rows) => {
          patchUser = {
            first_name: rows[0].first_name,
            last_name: rows[0].last_name,
            email: rows[0].email,
            gymId: rows[0].gym_id,
            membershipCode: rows[0].gym_membership_code,
          };
          res.json(patchUser);
        })
        .catch(err => next(err));
    });
});

module.exports = router;
