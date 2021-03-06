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
  // get listings that haven't been ordered yet by joining from order
  knex('public.order')
    .select('listing.*')
    .leftJoin('listing')
    .where('listing.gym_id', gym_id)
    .andWhere('listing.date', date)
    .whereNull('listing.id')
    .then((rows) => {
      console.log(rows[0]);
      if (rows[0]) {
        res.send(rows[0]);
      } else {
        res.send(JSON.stringify(false));
      }
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
