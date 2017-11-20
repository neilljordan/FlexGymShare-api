'use strict';

const express = require('express');
const knex = require('../knex');
const router = express.Router();
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);


router.get('/dates', (req, res, next) => {
  console.log('get hit')
  knex('dates')
  .orderBy('id')
  .then((dates) => {
    res.json(dates);
  })
  .catch((err) => {
    next(err)
  })
});

router.get('/dates/:id', (req, res, next) =>{
  const id = req.params.id;
  knex('dates')
  .where('id', id)
  .then((dates) => {
    res.json(dates)
  })
  .catch((err) => next(err))
});

router.post('/dates', (req, res, next) => {
  // console.log('hitting post')
  const { arr } = req.body
  // console.log(req.body.arr)
  knex('dates')
  .insert(arr)
  .returning('*')
  .then((dates)=>{
    console.log(dates)
    res.json(dates)
  })
  .catch((err)=>next(err))
});

router.patch('/dates/:id', function(req, res, next) {
// console.log('hit patch')
  const id = req.params.id
  // console.log(id)
  const { membership_id, date_available, booked } = req.body

  let patchDate = {}

  if (membership_id) {
    patchDate.membership_id = membership_id
  }
  if (date_available) {
    patchDate.date_available = date_available
  }
  if (booked) {
    patchDate.booked = booked
  }
  console.log(membership_id)
  // console.log(patchDate)
  knex('dates')
  .where('id', id)

  .then((dates)=>{
    console.log(dates)
    knex('dates')
    .update(patchDate)
    .where('id', id)
    .returning('*')

    .then((dates)=>{
      console.log(dates)
      let patchDate = {
        membership_id: dates[0].membership_id,
        date_available: dates[0].date_available,
        booked: dates[0].booked
      }
      console.log(patchDate.membership_id)
      res.json(patchDate)
    })
    .catch((err)=>next(err))
  })
});

router.delete('/dates/', function(req, res, next) {
  const id = req.params.id
  knex('dates')

  .then((dates)=>{
    knex('dates')
    .del()
    // .where('id', id)
    .returning('*')

      .then((dates)=>{
        let date = {
          membership_id: dates[0].membership_id,
          date_available: dates[0].date_available,
          booked: dates[0].booked
        }
        res.json(date)
      })
    .catch((err)=>next(err))
  })
});


router.delete('/dates/:id', function(req, res, next) {
  const id = req.params.id
  knex('dates')

  .then((dates)=>{
    knex('dates')
    .del()
    .where('id', id)
    .returning('*')

      .then((dates)=>{
        let date = {
          membership_id: dates[0].membership_id,
          date_available: dates[0].date_available,
          booked: dates[0].booked
        }
        res.json(date)
      })
    .catch((err)=>next(err))
  })
});

module.exports = router;
