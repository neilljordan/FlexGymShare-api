'use strict';

const express = require('express');
const knex = require('../knex');
const router = express.Router();
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

router.get('/users', (req, res, next) => {
  knex('users')
  .orderBy('id')
  .then((users) => {
    res.json(users);
  })
  .catch((err) => {
    next(err)
  })
});

router.get('/users/email/:email', (req, res, next) => {
  let email = req.params.email

  knex('users')
  .where('email', email)
  .first()
  .then((user) => {
    if (user) {
      res.send(JSON.stringify(true))
    } else {
      res.send(JSON.stringify(false))
    }
  })
  .catch((err) => next(err))

})

router.get('/users/uid/:uid', (req, res, next) => {
  let uid = req.params.uid

  knex('users')
  .where('facebookUID', uid)
  .first()
  .then((user) => {
    if (user) {
      res.send(JSON.stringify(user))
    } else {
      res.send(JSON.stringify(false))
    }
  })
  .catch((err) => next(err))

})

router.get('/users/:email/:displayName/:profileImage/:uid', (req, res, next) => {
  console.log('hi')
  let email = req.params.email
  let displayName = req.params.displayName
  let displayNameArray = displayName.split(' ')
  let first_name = displayNameArray[0]
  let last_name = displayNameArray[1]
  let profile_image = decodeURIComponent(req.params.profileImage)
  let createdAt = req.body
  console.log(createdAt)

  let facebookUID = req.params.uid
  // profile_image = profile_image.replace(/%/g, '?')

  knex('users')
  .where('email', email)
  .first()
  .then((user) => {
     console.log(user)
     console.log('typeof' + typeof(user))
    if (user) {
     console.log('email already exists')
     console.log(user.id)
     let id = user.id
     console.log(id)
     return res.send(JSON.stringify(user))
    } else {
      console.log('email doesnt exisit')
      let password = 'facebook_user_password'
      let hashed_password = bcrypt.hashSync(password, salt)
      const insertUser = {first_name, last_name, email, hashed_password, profile_image, facebookUID}
      console.log(insertUser)
      return knex('users')
      .insert((insertUser), ('*'))
      .then((newUser) => {
        res.send(JSON.stringify(newUser[0]))
      })
    }
  })
  .catch((err) => next(err))
})

router.get('/users/:id', (req, res, next) =>{
  const id = req.params.id;
  knex('users')
  .where('id', id)
  .then((users) => {
    res.json(users)
  })
  .catch((err) => next(err))
});

router.post('/users', (req, res, next) => {

  const { first_name, last_name, email, password, profile_image } = req.body

  knex('users')
  .insert({
    first_name: first_name,
    last_name: last_name,
    email: email,
    // stars,
    // comments,
    hashed_password: bcrypt.hashSync(password, salt),
    profile_image: profile_image
    // token,
    // fb_user
  })
  .returning('*')
  .then((users)=>{
    let user = {
      id: users[0].id,
      first_name: users[0].first_name,
      last_name: users[0].last_name,
      email: users[0].email,
    }
    res.json(users)
  })
  .catch((err)=>next(err))
});

router.patch('/users/:id', function(req, res, next) {
// console.log('hit patch')
  const id = req.params.id
  // console.log(id)
  let password = ''
  let hashed_password = ''
  // console.log(hashed_password)
  // console.log(id)
  console.log(req.body)
  const { first_name, last_name, email, gym_id } = req.body

  let patchUser = {}

  if (first_name) {
    patchUser.first_name = first_name
  }
  if (last_name) {
    patchUser.last_name = last_name
  }
  if (email) {
    patchUser.email = email
  }
  if (password) {
    patchUser.hashed_password = hashed_password
  }

  console.log(id)
  console.log(patchUser)
  knex('users')
  .where('id', id)

  .then((users)=>{
    console.log(users)
    knex('users')
    .update(patchUser)
    .where('id', id)
    .returning('*')

    .then((users)=>{
      console.log(users)
      let patchUser = {
        // id: users[0].id,
        first_name: users[0].first_name,
        last_name: users[0].last_name,
        email: users[0].email,
        hashed_password: users[0].hashed_password
      }
      res.json(patchUser)
    })
    .catch((err)=>next(err))
  })
})

router.delete('/users/:id', function(req, res, next) {
  const id = req.params.id
  knex('users')

  .then((users)=>{
    knex('users')
    .del()
    .where('id', id)
    .returning('*')

      .then((users)=>{
        let user = {
          title: users[0].title,
          author: users[0].author,
          genre: users[0].genre,
          description: users[0].description,
          coverUrl: users[0].cover_url
        }
        res.json(user)
      })
    .catch((err)=>next(err))
  })
});

module.exports = router;
