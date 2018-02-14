const express = require('express');
const knex = require('../knex');

const router = express.Router();

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

router.get('/listings/gym/:gym_id/:date', (req, res, next) => {
  const { gym_id, date } = req.params;
  console.log(gym_id, date);

  knex('listing')
    .where('gym_id', gym_id)
    .andWhere('date', date)
    .andWhere('renter_id', null)
    .then((listings) => {
      console.log(listings[0]);
      if (listings[0]) {
        res.send(listings[0]);
      } else {
        res.send(JSON.stringify(false));
      }
    });
})

router.get('/listings/:id', (req, res, next) => {
  const listingId = req.params.id;
  knex('listing')
    .where('id', listingId)
    .then((listing) => {
      res.json(listing);
    })
    .catch(err => next(err));
});

router.get('/listings/user/:id', (req, res, next) => {
  const userId = req.params.id;
  knex('listing')
    .where('lister_id', userId)
    .orderBy('date')
    .then((listing) => {
      res.json(listing);
    })
    .catch(err => next(err));
});

router.post('/listings', (req, res, next) => {
  const {
    lister_id, 
    gym_id,
    date,
  } = req.body;

  knex('listing')
    .insert({
      lister_id,
      gym_id,
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
    user_id, gym_id, is_purchased, date
  } = req.body;

  const patchListing = {};

  if (user_id) {
    patchListing.lister_id = user_id;
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
