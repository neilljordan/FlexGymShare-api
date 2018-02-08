const express = require('express');
const knex = require('../knex');
const email = require('../utilities/email');

const router = express.Router();

// table.increments('id').primary()
// table.string('email').notNullable();
// table.integer('gym_id').references('gym.id').onDelete('CASCADE').index()
// table.integer('role_id').references('role.id').onDelete('CASCADE')
// table.date('date_sent').notNullable();
// table.date('date_accepted').notNullable();
// table.string('code').notNullable();
// table.integer('sender_id').references('user.id').onDelete('CASCADE')
// table.integer('acceptor_id').references('user.id').onDelete('CASCADE')

router.get('/invites', (req, res, next) => {
  knex('invite')
    .orderBy('id')
    .then((invites) => {
      res.json(invites);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/invites/:id', (req, res, next) => {
  const inviteId = req.params.id;
  knex('invite')
    .where('id', inviteId)
    .then((invite) => {
      res.json(invite);
    })
    .catch(err => next(err));
});

router.get('/invites/gym/:id', (req, res, next) => {
  const gymId = req.params.id;
  knex('invite')
    .where('gym_id', gymId)
    .orderBy('date_sent')
    .then((invites) => {
      res.json(invites);
    })
    .catch(err => next(err));
});

router.get('/invites/code/:code', (req, res, next) => {
  const code = req.params.code;
  knex('invite')
    .where('code', code)
    .first()
    .then((invite) => {
      if (invite) {
        res.json(invite);
      } else {
        res.send(JSON.stringify(false))
      }
    })
    .catch(err => next(err));
});

router.post('/invites', (req, res, next) => {
  const {
    email, gym_id, role_id, date_sent, code, sender_id, status,
  } = req.body;

  console.log(date_sent)

  knex('invite')
    .insert({
      email,
      gym_id,
      role_id,
      date_sent,
      code,
      sender_id,
      status,
    })
    .returning('*')
    .then((newInvite) => {
      res.json(newInvite[0]);
    })
    .catch(err => next(err));

  const emailContact = {
    email: email,
    custom_fields: {
      invite_code: code,
      invite_gym: gym_id, // TODO: provide the gym name instead of the ID
    },
  };

  email.createSubscriber(emailContact); // TODO: do we want to return something here?
});

router.patch('/invites/code/:code', (req, res, next) => {
  const code = req.params.code;
  const {
    date_accepted, acceptor_id
  } = req.body;

  const patchInvite = {};

  if (!date_accepted || !acceptor_id) {
    //throw error these are required to patch
    res.status(500).send('You need both date_accepted && acceptor_id!!!!')
  }

  patchInvite.date_accepted = date_accepted;
  patchInvite.acceptor_id = acceptor_id;

  knex('invite')
    .where('code', code)
    .then((invite) => {
      knex('invite')
        .update(patchInvite)
        .where('code', code)
        .returning('*')
        .then((newInvite) => {
          res.json(newInvite);
        })
        .catch(err => next(err));
    });
});

router.delete('/invites/:id', (req, res, next) => {
  const inviteId = req.params.id;

  knex('invite')
    .then((invites) => {
      knex('invite')
        .del()
        .where('id', inviteId)
        .returning('*')
        .then((deletedInvite) => {
          res.json(deletedInvite);
        })
        .catch(err => next(err));
    });
});

module.exports = router;
