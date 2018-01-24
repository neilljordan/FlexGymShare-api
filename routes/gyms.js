const express = require('express');
const knex = require('../knex');
const bcrypt = require('bcrypt');

const router = express.Router();
const salt = bcrypt.genSaltSync(10);

router.get('/gyms', (req, res, next) => {
  knex('gyms')
    .select('*')
    // using raw SQL to add amenities to gyms
    //.column(knex.raw('(select array(select amenities.name from amenities, gym_amenities where gym_amenities.gym_id = gyms.id and gym_amenities.amenity_id = amenities.id) as amenities_available)'))
    .orderBy('gyms.id')
    .then((gyms) => {
      res.json(gyms);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/gyms/:id', (req, res, next) => {
  const id = req.params.id;
  knex('gyms')
    .where('id', id)
    .then((gyms) => {
      res.json(gyms);
    })
    .catch(err => next(err));
});

router.post('/gyms', (req, res, next) => {
  const { name, address, price } = req.body;
  knex('gyms')
    .insert({
      name: name,
      address: address,
      price: price,
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

router.patch('/gyms/:id', (req, res, next) => {
// console.log('hit patch')
  const id = req.params.id
  // console.log(id)
  const { name, address, price } = req.body;

  let patchGym = {}

  if (name) {
    patchGym.name = name;
  }
  if (address) {
    patchGym.address = address;
  }
  if (price) {
    patchGym.price = price;
  }
  knex('gyms')
    .where('id', id)
    .then((gyms) => {
      knex('gyms')
        .update(patchGym)
        .where('id', id)
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

router.delete('/gyms/:id', function(req, res, next) {
  const id = req.params.id
  knex('gyms')

  .then((gyms)=>{
    knex('gyms')
    .del()
    .where('id', id)
    .returning('*')

      .then((gyms)=>{
        let gym = {
          name: gyms[0].name,
          address: gyms[0].address,
          price: gyms[0].price
        }
        res.json(gym)
      })
    .catch((err)=>next(err))
  })
});

module.exports = router;
