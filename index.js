'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const morgan = require('morgan');
const cors = require('cors')
const path = require('path');

const users = require('./routes/users');
const gyms = require('./routes/gyms');
const memberships = require('./routes/memberships');
const dates = require('./routes/dates');
const token = require('./routes/token');
const ammenities = require('./routes/ammenities')

var bcrypt = require('bcrypt');
const knex = require('./knex');
var salt = bcrypt.genSaltSync(10);
const cookieSession = require('cookie-session')

//test hi LOL
//kjdslfsdjf

app.use(function(req, res, next) {
  // res.header("Access-Control-Allow-Origin", `https://test.flexgymshare.com`)//for running locally
  res.header("Access-Control-Allow-Origin", `http://localhost:3000`)//for running locally
  res.header("Access-Control-Allow-Credentials", "true")
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PATCH,PUT")
  res.header("Access-Control-Allow-Headers", "Content-Type, Accept")
  next()
})

//

app.use(cookieSession({ secret: 'keyboard cat' }));


app.use(bodyParser.json()); //keep before routes
// app.use(cors());
app.use(morgan('dev'))
app.use(cookieParser());

app.use('/', users);
app.use('/', gyms);
app.use('/', memberships);
app.use('/', dates);
app.use('/', token);
app.use('/', ammenities)


app.use(express.static(path.join(__dirname, 'public')));

app.use((_req, res) => {
res.sendStatus(404);
});


const port = process.env.PORT || 3131; //for deployment
// const port = process.env.PORT || 3000; //for running locally


app.listen(port, () => {
console.log('Listening on port', port);
});
//
module.exports = app;
