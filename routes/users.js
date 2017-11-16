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
  console.log('was good')
  console.log(req.body)
  const { first_name, last_name, email, password } = req.body
  console.log(req.body)
  console.log(bcrypt)
  console.log(salt)
  knex('users')
  .insert({
    first_name: first_name,
    last_name: last_name,
    email: email,
    // stars,
    // comments,
    hashed_password: bcrypt.hashSync(password, salt)
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

  const id = req.params.id
  const { first_name, last_name, email, password } = req.body

  let newBook = {}

  if (title) {
    newBook.title = title
  }
  if (author) {
    newBook.author = author
  }
  if (genre) {
    newBook.genre = genre
  }
  if (description) {
    newBook.description = description
  }
  if (coverUrl) {
    newBook.cover_url = coverUrl
  }

  knex('books')
  .where('id', id)

  .then((books)=>{
    knex('books')
    .update(newBook)
    .where('id',id)
    .returning('*')

    .then((books)=>{
      let book = {
        id: books[0].id,
        title: books[0].title,
        author: books[0].author,
        genre: books[0].genre,
        description: books[0].description,
        coverUrl: books[0].cover_url
      }
      res.json(book)
    })
    .catch((err)=>next(err))
  })
})

// router.delete('/books/:id', function(req, res, next) {
//   const id = req.params.id
//   knex('books')
//
//   .then((books)=>{
//     knex('books')
//     .del()
//     .where('id', id)
//     .returning('*')
//
//       .then((books)=>{
//         let book = {
//           title: books[0].title,
//           author: books[0].author,
//           genre: books[0].genre,
//           description: books[0].description,
//           coverUrl: books[0].cover_url
//         }
//         res.json(book)
//       })
//     .catch((err)=>next(err))
//   })
// });

module.exports = router;
