const express = require('express');
const knex = require('../knex');
const bcrypt = require('bcrypt');

const router = express.Router();
const salt = bcrypt.genSaltSync(10);

// get all users
router.get('/users', (req, res, next) => {
  knex('user')
    .orderBy('id')
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      next(err);
    });
});

// get user by integer id
router.get('/users/:id', (req, res, next) => {
  const userId = req.params.id;
  knex('user')
    .where('id', userId)
    .first()
    .then((users) => {
      res.json(users);
    })
    .catch(err => next(err));
});

// get user by email
router.get('/users/email/:email', (req, res, next) => {
  const userEmail = req.params.email;
  knex('user')
    .where('email', userEmail)
    .first()
    .then((user) => {
      if (user) {
        res.send(JSON.stringify(true));
      } else {
        res.send(JSON.stringify(false));
      }
    })
    .catch(err => next(err));
});

// get user by Facebook UID
router.get('/users/uid/:uid', (req, res, next) => {
  const fbId = req.params.uid;
  knex('user')
    .where('facebook_uid', fbId)
    .first()
    .then((user) => {
      if (user) {
        res.send(JSON.stringify(user));
      } else {
        res.send(JSON.stringify(false));
      }
    })
    .catch(err => next(err));
});

// create a new user
router.post('/users', (req, res, next) => {
  const {
    first_name, last_name, email, profile_image, facebookUID,
  } = req.body;

  knex('user')
    .insert({
      first_name,
      last_name,
      email,
      facebook_uid: facebookUID,
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
    first_name, last_name, email, gymId
  } = req.body;
  const patchUser = {};

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

  knex('user')
    .where('id', userId)
    .then((users) => {
      knex('user')
        .update(patchUser)
        .where('id', userId)
        .returning('*')
        .then((users) => {
          const patchUser = {
            id: users[0].id,
            first_name: users[0].first_name,
            last_name: users[0].last_name,
            email: users[0].email,
            hashed_password: users[0].hashed_password,
            gymId: users[0].gym_id,
          };
          res.json(patchUser);
        })
        .catch(err => next(err));
    });
});

// delete a user
router.delete('/users/:id', (req, res, next) => {
  const userId = req.params.id;
  knex('user')
    .then((users) => {
      knex('user')
        .del()
        .where('id', userId)
        .returning('*')
        .then((users) => {
          const user = {
            title: users[0].title,
            author: users[0].author,
            genre: users[0].genre,
            description: users[0].description,
            coverUrl: users[0].cover_url,
          };
          res.json(user);
        })
        .catch(err => next(err));
    });
});

module.exports = router;
