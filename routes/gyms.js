const express = require('express');
const knex = require('../knex');
const config = require('config');


const router = express.Router();

// get all gyms
router.get('/gyms', (req, res, next) => {
  // const gyms = req.body
  const { default_price, off_peak_price } = req.body;

  knex('gym')
    .select('*')
    // using raw SQL to add amenities to gyms
    .column(knex.raw('(select array(select amenity.name from amenity, gym_amenities where gym_amenities.gym_id = gym.id and gym_amenities.amenity_id = amenity.id) as amenities_available)'))
    .column(knex.raw('(select array(select date from blackout_date where blackout_date.gym_id = gym.id) as blackout_dates)'))
    .column(knex.raw('(SELECT array(SELECT day_of_week || \':\' || start_time || \'-\'  || end_time FROM gym_hours WHERE gym.id = gym_hours.gym_id AND is_off_peak = FALSE) as opening_hours)'))
    .column(knex.raw('(SELECT array(SELECT day_of_week || \':\' || start_time || \'-\'  || end_time FROM gym_hours WHERE gym.id = gym_hours.gym_id AND is_off_peak = TRUE) as off_peak_hours)'))
    .column(knex.raw('(SELECT array(SELECT gym_config.name || \':\' || gym_config.value FROM gym_config WHERE gym.id = gym_config.gym_id) as gym_config)'))
    .orderBy('gym.id')
    .then((gyms) => {
      res.json(gyms);
    })
    .catch((err) => {
      next(err);
    });
});

// get gym by id
router.get('/gyms/:id', (req, res, next) => {
  const gymId = req.params.id;
  knex('gym')
    .select('*')
    // using raw SQL to add amenities to gyms
    .column(knex.raw('(select array(select amenity.name from amenity, gym_amenities where gym_amenities.gym_id = gym.id and gym_amenities.amenity_id = amenity.id) as amenities_available)'))
    .column(knex.raw('(select array(select date from blackout_date where blackout_date.gym_id = gym.id) as blackout_dates)'))
    .column(knex.raw('(SELECT array(SELECT day_of_week || \':\' || start_time || \'-\'  || end_time FROM gym_hours WHERE gym.id = gym_hours.gym_id AND is_off_peak = FALSE) as opening_hours)'))
    .column(knex.raw('(SELECT array(SELECT day_of_week || \':\' || start_time || \'-\'  || end_time FROM gym_hours WHERE gym.id = gym_hours.gym_id AND is_off_peak = TRUE) as off_peak_hours)'))
    .column(knex.raw('(SELECT array(SELECT gym_config.name || \':\' || gym_config.value FROM gym_config WHERE gym.id = gym_config.gym_id) as gym_config)'))
    .where('id', gymId)
    .then((gyms) => {
      res.json(gyms);
    })
    .catch(err => next(err));
});

// TODO: needs to be fixed or removed
router.post('/gyms', (req, res, next) => {
  const { name, address, price } = req.body;
  knex('gym')
    .insert({
      name,
      address,
      price,
    })
    .returning('*')
    .then((gyms) => {
      const gym = {
        id: gyms[0].id,
        first_name: gyms[0].first_name,
        last_name: gyms[0].last_name,
        email: gyms[0].email,
      };
      res.json(gym);
    })
    .catch(err => next(err));
});

// needs to be fixed or removed
router.patch('/gym/:id', (req, res, next) => {
  const gymId = req.params.id;
  const { name, address, price } = req.body;
  const patchGym = {};

  if (name) {
    patchGym.name = name;
  }
  if (address) {
    patchGym.address = address;
  }
  if (price) {
    patchGym.price = price;
  }

  knex('gym')
    .where('id', gymId)
    .then((gyms) => {
      knex('gym')
        .update(patchGym)
        .where('id', gymId)
        .returning('*')
        .then((gyms) => {
          let patchGym = {
            name: gyms[0].name,
            address: gyms[0].address,
            price: gyms[0].price,
          };
          res.json(patchGym);
        })
        .catch(err => next(err));
    });
});

// needs to be fixed or removed
router.delete('/gyms/:id', (req, res, next) => {
  const gymId = req.params.id;
  knex('gym')
    .then((gyms) => {
      knex('gym')
        .del()
        .where('id', gymId)
        .returning('*')
        .then((gyms) => {
          const gym = {
            name: gyms[0].name,
            address: gyms[0].address,
            price: gyms[0].price,
          };
          res.json(gym);
        })
        .catch(err => next(err));
    });
});

module.exports = router;
