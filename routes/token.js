require('dotenv').config();

// const boom = require('boom'); REMOVE??
const express = require('express');
const knex = require('../knex');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const router = express.Router();
const SECRET = process.env.JWT_KEY;

router.get('/token', (req, res, next) => {
  jwt.verify(req.cookies.token, SECRET, (err, _payload) => {
    if (err) {
      res.send(false);
    } else {
      res.send(true);
    }
  });
});

router.post('/token', (req, res, next) => {
  if (!req.body.email || !req.body.password) res.status(400);
  // const data = { email: req.body.email,
  //                password: req.body.password
  //               }
  knex('users')
    .where('email', req.body.email)
    .returning('*')
    .first()
    .then((data) => {
      // console.log('this is email '+email)
      // console.log(`this is data ${JSON.stringify(data)}`);
      if (!data) {
        res.status(400);
        res.setHeader('Content-Type', 'text/plain');
        res.send('You playin?');
      } else if (bcrypt.compareSync(req.body.password, data.hashed_password)) {
        // console.log(process.env.JWT_KEY);
        const token = jwt.sign({ id: data.id }, process.env.JWT_KEY);
        // console.log(`this is token black guy token ${token}`);
        res.cookie('token', token, { httpOnly: true });
        res.send({
          id: data.id, email: data.email, firstName: data.first_name, lastName: data.last_name,
        });
      } else {
        res.status(400);
        res.setHeader('Content-type', 'text/plain');
        res.send('Sorry bud, no can do');
      }
    })
    .catch(next);
});

router.delete('/token', (req, res, next) => {
  res.clearCookie('token');
  res.send();
});

module.exports = router;
