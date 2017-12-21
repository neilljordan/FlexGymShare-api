'use strict';

const express = require('express');
const knex = require('../knex');
const router = express.Router();
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);


router.get('/daypasses', (req, res, next) => {
  console.log('get hit')
  knex('daypasses')
  .orderBy('id')
  .then((daypasses) => {
    res.json(daypasses);
  })
  .catch((err) => {
    next(err)
  })
});

router.get('/daypasses/renter_id/:id', (req, res, next) =>   {
  let id = req.params.id
  knex('daypasses')
  .where('user_id', id)
  .then((daypasses) => {
    res.json(daypasses);
  })
  .catch((err) => {
    next(err)
  })
})

router.get('/daypasses/:id', (req, res, next) =>{
  const id = req.params.id;
  knex('daypasses')
  .where('id', id)
  .then((daypass) => {
    res.json(daypass)
  })
  .catch((err) => next(err))
});

router.post('/daypasses', (req, res, next) => {
  // console.log('hitting post')
  const { arr } = req.body
  // console.log(req.body.arr)
  knex('daypasses')
  .insert(arr)
  .returning('*')
  .then((daypass)=>{
    res.json(daypass)
  })
  .catch((err)=>next(err))
});

router.delete('/daypasses/:id', function(req, res, next) {
  const id = req.params.id
  knex('daypasses')

  .then((dates)=>{
    knex('daypasses')
    .del()
    .where('id', id)
    .returning('*')

      .then((date)=>{
        res.json(date[0])
      })
    .catch((err)=>next(err))
  })
});

module.exports = router;
