const express = require('express');
const knex = require('../knex');
const drip = require('../utilities/dripClient');
const crypto = require('crypto');

const router = express.Router();

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
        res.send(JSON.stringify(false));
      }
    })
    .catch(err => next(err));
});

router.post('/invites', (req, res, next) => {
  const {
    email, gym_id, role_id, date_sent, code, sender_id, status,
  } = req.body;

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
    email,
    custom_fields: {
      invite_code: code,
      invite_gym: gym_id, // TODO: replace with gym name
    },
  };

  drip.createSubscriber(emailContact); // TODO: do we want to return something here?
});

function getOwnerEmailByGymId(id) {
  return knex.select('owner_email').from('gym').where('gym.id', id)
    .then((query) => {
      const result = JSON.stringify(query);
      return result;
    });
}

// sends invite email to whichever address is in the gym table
router.post('/invites/owner/:gym_id', (req, res, next) => {
  let ownerEmail = '';
  const gymId = req.params.gym_id;
  const inviteCode = crypto.randomBytes(8).toString('hex');

  getOwnerEmailByGymId(gymId).then((result) => {
    // console.log(result);
    // const json = JSON.parse(result);
    ownerEmail = JSON.parse(result)[0].owner_email;
    return ownerEmail;
  })
    .then((param) => {
      console.log(param);
      knex('invite')
        .insert({
          email: param,
          gym_id: gymId,
          role_id: 2,
          date_sent: Date(),
          code: inviteCode,
          sender_id: 1,
          status: 'pending',
        })
        .returning('id')
        .then((rows) => {
          res.json(rows[0]);
          return rows;
        })
        .catch(err => next(err));
    })
    .then(() => {
      drip.createSubscriber({
        email: ownerEmail,
        custom_fields: {
          invite_code: inviteCode,
          invite_gym: gymId, // TODO: replace with gym name
        },
      });
    });
});

router.patch('/invites/code/:code', (req, res, next) => {
  const code = req.params.code;
  const {
    date_accepted, acceptor_id, status,
  } = req.body;

  const patchInvite = {};

  if (!date_accepted || !acceptor_id || !status) {
    // throw error these are required to patch
    res.status(500).send('You need both date_accepted && acceptor_id && status!!!!');
  }

  patchInvite.date_accepted = date_accepted;
  patchInvite.acceptor_id = acceptor_id;
  patchInvite.status = status;

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
