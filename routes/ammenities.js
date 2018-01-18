'use strict';

const express = require('express');
const knex = require('../knex');
const router = express.Router();

//
//


router.get('/ammenities', (req, res, next) => {
  knex('ammenities')
  .orderBy('id')
  .then((ammenities) => {
    res.json(ammenities);
  })
  .catch((err) => {
    next(err)
  })
});

router.get('/ammenities/:id', (req, res, next) =>{
  const id = req.params.id;
  knex('ammenities')
  .where('id', id)
  .then((ammenities) => {
    res.json(ammenities)
  })
  .catch((err) => next(err))
});

router.post('/ammenities', (req, res, next) => {

  const { gym_id, cardio, weight_room, yoga, tennis, racketball, basketball, pool, spa, parking } = req.body

  knex('ammenities')
  .insert({
    gym_id: gym_id,
    cardio: cardio,
    weight_room: weight_room,
    yoga: yoga,
    tennis: tennis,
    racketball: racketball,
    basketball: basketball,
    pool: pool,
    spa: spa,
    parking: parking
  })
  .returning('*')
  .then((ammenities)=>{
    let ammenity = {
      gym_id: ammenities[0].gym_id,
      cardio: ammenities[0].cardio,
      weight_room: ammenities[0].weight_room,
      yoga: ammenities[0].yoga,
      tennis: ammenities[0].tennis,
      racketball: ammenities[0].racketball,
      basketball: ammenities[0].basketball,
      pool: ammenities[0].pool,
      spa: ammenities[0].spa,
      parking: ammenities[0].parking
    }
    res.json(ammenities)
  })
  .catch((err)=>next(err))
});

router.patch('/ammenities/:id', function(req, res, next) {

  const id = req.params.id

  const { gym_id, cardio, weight_room, yoga, tennis, racketball, basketball, pool, spa, parking } = req.body

  let patchAmmenity = {}

  if (gym_id) {
    patchAmmenity.gym_id = gym_id
  }
  if (cardio) {
    patchAmmenity.cardio = cardio
  }
  if (weight_room) {
    patchAmmenity.weight_room = weight_room
  }
  if (yoga) {
    patchAmmenity.yoga = yoga
  }
  if (tennis) {
    patchAmmenity.tennis = tennis
  }
  if (racketball) {
    patchAmmenity.racketball = racketball
  }
  if (basketball) {
    patchAmmenity.basketball = basketball
  }
  if (pool) {
    patchAmmenity.pool = pool
  }
  if (spa) {
    patchAmmenity.spa = spa
  }
  if (parking) {
    patchAmmenity.parking = parking
  }
  console.log(id)
  console.log(patchAmmenity)
  knex('ammenities')
  .where('id', id)

  .then((ammenities)=>{
    console.log(ammenities)
    knex('ammenities')
    .update(patchAmmenity)
    .where('id', id)
    .returning('*')

    .then((ammenities)=>{
      console.log(ammenities)
      let patchAmmenity = {
        gym_id: ammenities[0].gym_id,
        cardio: ammenities[0].cardio,
        weight_room: ammenities[0].weight_room,
        yoga: ammenities[0].yoga,
        tennis: ammenities[0].tennis,
        racketball: ammenities[0].racketball,
        basketball: ammenities[0].basketball,
        pool: ammenities[0].pool,
        spa: ammenities[0].spa,
        parking: ammenities[0].parking
      }
      res.json(patchAmmenity)
    })
    .catch((err)=>next(err))
  })
})

router.delete('/ammenities/:id', function(req, res, next) {
  const id = req.params.id
  knex('ammenities')

  .then((ammenities)=>{
    knex('ammenities')
    .del()
    .where('id', id)
    .returning('*')

      .then((ammenities)=>{
        let ammenity = {
          gym_id: ammenities[0].gym_id,
          cardio: ammenities[0].cardio,
          weight_room: ammenities[0].weight_room,
          yoga: ammenities[0].yoga,
          tennis: ammenities[0].tennis,
          racketball: ammenities[0].racketball,
          basketball: ammenities[0].basketball,
          pool: ammenities[0].pool,
          spa: ammenities[0].spa,
          parking: ammenities[0].parking
        }
        res.json(ammenity)
      })
    .catch((err)=>next(err))
  })
});

module.exports = router;
