const express = require('express');
const knex = require('../knex');
const bcrypt = require('bcrypt');

const router = express.Router();
const salt = bcrypt.genSaltSync(10);

router.get('/ledger', (req, res, next) => {
  knex('transaction')
    .orderBy('id')
    .then((ledgers) => {
      res.json(ledgers);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/ledger/:id', (req, res, next) => {
  const ledgerId = req.params.id;
  knex('transaction')
    .where('id', ledgerId)
    .then((ledger) => {
      res.json(ledger[0]);
    })
    .catch(err => next(err));
});

router.post('/ledger', (req, res, next) => {
  const {
    gym_date, user_id, listing_id, ledger_hash, gym_id, currentTime,
  } = req.body;
  const pass = currentTime + gym_date + user_id + listing_id + gym_id;
  knex('transaction')
    .insert({
      gym_date,
      user_id,
      listing_id,
      ledger_hash: bcrypt.hashSync(pass, salt),
      gym_id,
    })
    .returning('*')
    .then((ledger) => {
      res.json(ledger[0]);
    })
    .catch(err => next(err));
});

router.patch('/ledger/:id', (req, res, next) => {
  const ledgerId = req.params.id;
  const { user_id, listing_id, ledger_hash } = req.body;
  const patchLedger = {};

  if (user_id) {
    patchLedger.user_id = user_id;
  }
  if (listing_id) {
    patchLedger.listing_id = listing_id;
  }
  if (ledger_hash) {
    patchLedger.ledger_hash = ledger_hash;
  }

  knex('transaction')
    .where('id', ledgerId)
    .then((ledger) => {
      knex('transaction')
        .update(patchLedger)
        .where('id', ledgerId)
        .returning('*')
        .then((newLedger) => {
          res.json(newLedger);
        })
        .catch(err => next(err));
    });
});

router.delete('/ledger/:id', (req, res, next) => {
  const ledgerId = req.params.id;
  knex('transaction')
    .then((ledger) => {
      knex('transaction')
        .del()
        .where('id', ledgerId)
        .returning('*')
        .then((deletedLedger) => {
          res.json(deletedLedger);
        })
        .catch(err => next(err));
    });
});

module.exports = router;
