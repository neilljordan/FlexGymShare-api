const express = require('express');
const knex = require('../knex');
const bcrypt = require('bcrypt');

const router = express.Router();
const salt = bcrypt.genSaltSync(10);

router.get('/listings', (req, res, next) => {
  knex('listing')
    .orderBy('id')
    .then((listings) => {
      res.json(listings);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/listings/:id', (req, res, next) => {
  const listingId = req.params.id;
  knex('listing')
    .where('id', listingId)
    .then((listing) => {
      res.json(listing);
    })
    .catch(err => next(err));
});

router.post('/listings', (req, res, next) => {
  const {
    user_id, gym_id, purchased, date,
  } = req.body;

  knex('listing')
    .insert({
      user_id,
      gym_id,
      purchased: false,
      date,
    })
    .returning('*')
    .then((listing) => {
      res.json(listing[0]);
    })
    .catch(err => next(err));
});

router.patch('/listings/:id', (req, res, next) => {
  const listingId = req.params.id;
  const {
    user_id, gym_id, purchased, date 
  } = req.body;

  const patchListing = {};

  if (user_id) {
    patchListing.user_id = user_id;
  }
  if (gym_id) {
    patchListing.gym_id = gym_id;
  }
  if (purchased) {
    patchListing.purchased = purchased;
  }
  if (date) {
    patchListing.date = date;
  }

  knex('listing')
    .where('id', listingId)
    .then((listing) => {
      knex('listing')
        .update(patchListing)
        .where('id', listingId)
        .returning('*')
        .then((newListing) => {
          res.json(newListing);
        })
        .catch(err => next(err));
    });
});

router.delete('/listings/:id', (req, res, next) => {
  const listingId = req.params.id;

  knex('listing')
    .then((listings) => {
      knex('listing')
        .del()
        .where('id', listingId)
        .returning('*')
        .then((deletedListing) => {
          res.json(deletedListing);
        })
        .catch(err => next(err));
    });
});

module.exports = router;
