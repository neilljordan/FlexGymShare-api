'use strict';

const express = require('express');
const knex = require('../knex');
const router = express.Router();
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

router.get('/ledger', (req, res, next) => {
  knex('ledger')
  .orderBy('id')
  .then((ledgers) => {
    res.json(ledgers);
  })
  .catch((err) => {
    next(err)
  })
});

router.get('/ledger/:id', (req, res, next) =>{
  const id = req.params.id;
  knex('ledger')
  .where('id', id)
  .then((ledger) => {
    res.json(ledger[0])
  })
  .catch((err) => next(err))
});

router.post('/ledger', (req, res, next) => {
  const { gym_date, user_id, listing_id, ledger_hash, gym_id, currentTime } = req.body
  let pass = currentTime+gym_date+user_id+listing_id+gym_id
  knex('ledger')
  .insert({
    gym_date: gym_date,
    user_id: user_id,
    listing_id: listing_id,
    ledger_hash: bcrypt.hashSync(pass, salt),
    gym_id: gym_id
  })
  .returning('*')
  .then((ledger)=>{
    res.json(ledger[0])
  })
  .catch((err)=>next(err))
});

router.patch('/ledger/:id', function(req, res, next) {
// console.log('hit patch')
  const id = req.params.id
  // console.log(id)
  const { user_id, listing_id, ledger_hash } = req.body

  let patchLedger = {}

  if (user_id) {
    patchLedger.user_id = user_id
  }
  if (listing_id) {
    patchLedger.listing_id = listing_id
  }
  if (ledger_hash) {
    patchLedger.ledger_hash = ledger_hash
  }
  // console.log(id)
  // console.log(patchGym)
  knex('ledger')
  .where('id', id)

  .then((ledger)=>{
    knex('ledger')
    .update(patchLedger)
    .where('id', id)
    .returning('*')

    .then((newLedger)=>{
      res.json(newLedger)
    })
    .catch((err)=>next(err))
  })
});

router.delete('/ledger/:id', function(req, res, next) {
  const id = req.params.id
  knex('ledger')
  .then((ledger)=>{
    knex('ledger')
    .del()
    .where('id', id)
    .returning('*')
      .then((deletedLedger)=>{
        res.json(deletedLedger)
      })
    .catch((err)=>next(err))
  })
});

module.exports = router;
