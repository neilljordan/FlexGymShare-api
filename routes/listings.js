'use strict';

const express = require('express');
const knex = require('../knex');
const router = express.Router();
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

router.get('/listings', (req, res, next) => {
  knex('listings')
  .orderBy('id')
  .then((listings) => {
    res.json(listings);
  })
  .catch((err) => {
    next(err)
  })
});

router.get('/listings/:id', (req, res, next) =>{
  const id = req.params.id;
  knex('listings')
  .where('id', id)
  .then((listing) => {
    res.json(listing)
  })
  .catch((err) => next(err))
});

router.post('/listings', (req, res, next) => {
  console.log('hitting post')
  // console.log(req.body)
  const { user_id, gym_id, purchased, date } = req.body
  // console.log(req.body)
  // console.log(bcrypt)
  // console.log(salt)
  knex('listings')
  .insert({
    user_id: user_id,
    gym_id: gym_id,
    purchased: purchased,
    date: date
  })
  .returning('*')
  .then((listing)=>{
    res.json(listing)
  })
  .catch((err)=>next(err))
});

router.patch('/listings/:id', function(req, res, next) {
// console.log('hit patch')
  const id = req.params.id
  // console.log(id)
  const { user_id, gym_id, purchased, date } = req.body

  let patchListing = {}

  if (user_id) {
    patchListing.user_id = user_id
  }
  if (gym_id) {
    patchListing.gym_id = gym_id
  }
  if (purchased) {
    patchListing.price = price
  }
  if (date) {
    patchListing.date = date
  }
  // console.log(id)
  // console.log(patchGym)
  knex('listings')
  .where('id', id)

  .then((listing)=>{
    knex('listings')
    .update(patchListing)
    .where('id', id)
    .returning('*')

    .then((newListing)=>{
      res.json(newListing)
    })
    .catch((err)=>next(err))
  })
});

router.delete('/listings/:id', function(req, res, next) {
  const id = req.params.id
  knex('listings')
  .then((listings)=>{
    knex('listings')
    .del()
    .where('id', id)
    .returning('*')
      .then((deletedListing)=>{
        res.json(deletedListing)
      })
    .catch((err)=>next(err))
  })
});

module.exports = router;
