const express = require('express');
const knex = require('../knex');

const router = express.Router();

router.get('/configs', (req, res) => {
  knex('gym_config')
    .orderBy('id')
    .then((configs) => {
      res.json(configs);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/configs/:id', (req, res, next) => {
  const gym_id = req.params.id;
  knex('gym_config')
    .where('gym_id', gym_id)
    .then((config) => {
      res.json(config);
    })
    .catch(err => next(err));
});

router.post('/configs', (req, res, next) => {
  const {
    gym_id,
    name,
    value,
  } = req.body;

  console.log(gym_id)
  console.log(name)

  knex('gym_config')
    .where(function() {
      this.where('gym_id', gym_id).andWhere('name', name)
    })
    .then((newconfig) => {
      console.log(newConfig)
      res.json(newconfig[0]);
    })
    .catch(err => next(err));
    // .insert({
    //   gym_id,
    //   name,
    //   value,
    // })
    // .returning('*')
});

router.put('/configs/gym/:gym_id', (req, res, next) => {
  const gym_id = req.params.gym_id
  let { name, value } = req.body
  console.log(gym_id)
  console.log(name)
  console.log(value)
  name = name.toString()
  value = value.toString()

  let patch = {
    name,
    value,
  }

  let post = {
    gym_id,
    name,
    value
  }

  knex('gym_config')
    .where('gym_id', gym_id)
    .andWhere('name', name)
    .then((config) => {
      if (config) {
        //patch it
        knex('gym_config')
          .update(patch)
          .where('gym_id', gym_id)
          .andWhere('name', name)
          .returning('*')
          .then((patchedConfig) => {
            console.log(patchedConfig)
            res.json(patchedConfig[0]);
            res.end(500)
          })
          .catch(err => next(err));
      } else {
        knex('gym_config')
          .insert(post)
          .then((newConfig) => {
            res.json(newConfig);
          })
          .catch(err => next(err));
      }
    })

})

router.patch('/configs/:id', (req, res, next) => {
  const configId = req.params.id;
  const {
    gym_id,
    name,
    value,
  } = req.body;

  const patchconfig = {};

  if (name) {
    patchconfig.name = name;
  }

  knex('gym_config')
    .where('id', configId)
    .then((config) => {
      knex('gym_config')
        .update(patchconfig)
        .where('id', configId)
        .returning('*')
        .then((newconfig) => {
          res.json(newconfig);
        })
        .catch(err => next(err));
    });
});

router.delete('/configs/:id', (req, res, next) => {
  const configId = req.params.id;

  knex('gym_config')
    .then((config) => {
      knex('gym_config')
        .del()
        .where('id', configId)
        .returning('*')
        .then((deletedconfig) => {
          res.json(deletedconfig);
        })
        .catch(err => next(err));
    });
});


module.exports = router;
