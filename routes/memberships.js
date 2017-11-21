'use strict';

const express = require('express');
const knex = require('../knex');
const router = express.Router();
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

router.get('/memberships', (req, res, next) => {
  knex('memberships')
  .orderBy('id')
  .then((memberships) => {
    res.json(memberships);
  })
  .catch((err) => {
    next(err)
  })
});

router.get('/memberships/:id', (req, res, next) =>{
  const id = req.params.id;
  knex('memberships')
  .where('id', id)
  .then((memberships) => {
    res.json(memberships)
  })
  .catch((err) => next(err))
});

router.post('/memberships', (req, res, next) => {
  console.log('hitting post')
  console.log(req.body)
  const { user_id, gym_id } = req.body
  // console.log(req.body)
  // console.log(bcrypt)
  // console.log(salt)
  knex('memberships')
  .insert({
    user_id: user_id,
    gym_id: gym_id
  })
  .returning('*')
  .then((memberships)=>{
    let membership = {
      id: memberships[0].id,
      user_id: memberships[0].user_id,
      gym_id: memberships[0].gym_id
    }
    res.json(membership)
  })
  .catch((err)=>next(err))
});

// router.patch('/memberships/:id', function(req, res, next) {
// // console.log('hit patch')
//   const id = req.params.id
//   // console.log(id)
//   const { user_id, gym_id } = req.body
//
//   let patchMembership = {}
//
//   if (user_id) {
//     patchMembership.user_id = user_id
//   }
//   if (gym_id) {
//     patchMembership.gym_id = gym_id
//   }
//   // console.log(id)
//   // console.log(patchMembership)
//   knex('memberships')
//   .where('id', id)
//
//   .then((memberships)=>{
//     console.log(memberships)
//     knex('memberships')
//     .update(patchMembership)
//     .where('id', id)
//     .returning('*')
//
//     .then((memberships)=>{
//       console.log(memberships)
//       let patchMembership = {
//         user_id: memberships[0].user_id,
//         gym_id: memberships[0].gym_id      }
//       res.json(patchMembership)
//     })
//     .catch((err)=>next(err))
//   })
// });

router.delete('/memberships/:id', function(req, res, next) {
  const id = req.params.id
  knex('memberships')

  .then((memberships)=>{
    knex('memberships')
    .del()
    .where('id', id)
    .returning('*')

      .then((memberships)=>{
        let membership = {
          user_id: memberships[0].name,
          gym_id: memberships[0].address
        }
        res.json(membership)
      })
    .catch((err)=>next(err))
  })
});

module.exports = router;
