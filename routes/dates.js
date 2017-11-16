'use strict';

const express = require('express');
const knex = require('../knex');
const router = express.Router();
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

router.get('/dates', (req, res, next) => {
  knex('dates')
  .orderBy('id')
  .then((dates) => {
    res.json(dates);
  })
  .catch((err) => {
    next(err)
  })
});

// router.get('/gyms/:id', (req, res, next) =>{
//   const id = req.params.id;
//   knex('gyms')
//   .where('id', id)
//   .then((gyms) => {
//     res.json(gyms)
//   })
//   .catch((err) => next(err))
// });
//
// router.post('/gyms', (req, res, next) => {
//   console.log('hitting post')
//   // console.log(req.body)
//   const { name, address, price } = req.body
//   // console.log(req.body)
//   // console.log(bcrypt)
//   // console.log(salt)
//   knex('gyms')
//   .insert({
//     name: name,
//     address: address,
//     price: price,
//   })
//   .returning('*')
//   .then((gyms)=>{
//     let gym = {
//       id: gyms[0].id,
//       first_name: gyms[0].first_name,
//       last_name: gyms[0].last_name,
//       email: gyms[0].email,
//     }
//     res.json(gym)
//   })
//   .catch((err)=>next(err))
// });
//
// router.patch('/gyms/:id', function(req, res, next) {
// // console.log('hit patch')
//   const id = req.params.id
//   // console.log(id)
//   const { name, address, price } = req.body
//
//   let patchGym = {}
//
//   if (name) {
//     patchGym.name = name
//   }
//   if (address) {
//     patchGym.address = address
//   }
//   if (price) {
//     patchGym.price = price
//   }
//   // console.log(id)
//   // console.log(patchGym)
//   knex('gyms')
//   .where('id', id)
//
//   .then((gyms)=>{
//     console.log(gyms)
//     knex('gyms')
//     .update(patchGym)
//     .where('id', id)
//     .returning('*')
//
//     .then((gyms)=>{
//       console.log(gyms)
//       let patchGym = {
//         name: gyms[0].name,
//         address: gyms[0].address,
//         price: gyms[0].price,
//       }
//       res.json(patchGym)
//     })
//     .catch((err)=>next(err))
//   })
// });
//
// router.delete('/gyms/:id', function(req, res, next) {
//   const id = req.params.id
//   knex('gyms')
//
//   .then((gyms)=>{
//     knex('gyms')
//     .del()
//     .where('id', id)
//     .returning('*')
//
//       .then((gyms)=>{
//         let gym = {
//           name: gyms[0].name,
//           address: gyms[0].address,
//           price: gyms[0].price
//         }
//         res.json(gym)
//       })
//     .catch((err)=>next(err))
//   })
// });

module.exports = router;
