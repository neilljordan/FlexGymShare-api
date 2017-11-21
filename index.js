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

var bcrypt = require('bcrypt');
const knex = require('./knex');
var salt = bcrypt.genSaltSync(10);
const cookieSession = require('cookie-session')

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")//for deployment
  // res.header("Access-Control-Allow-Origin", "http://localhost:3001")//for running locally

  res.header("Access-Control-Allow-Credentials", "true")
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PATCH,PUT")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.use(cookieSession({ secret: 'keyboard cat' }));

const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy

passport.use(new FacebookStrategy (
  {
    clientID: '125954554766866',
    clientSecret: 'f539c416641d2c4c4fa8fbecfc819355',
    callbackURL:'https://flex-routes.herokuapp.com/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'email'],
    enableProof: true
  },

  function onSuccessfulLogin(token, refreshToken, profile, done) {
    done(null, {token, profile});
  }
));
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser((object, done) => {
  done(null, {token: object.token})
})
passport.deserializeUser((object, done) => {
    done(null, object)
})

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email']}));

// Step 2: Setting up the callback route
// makes 2 api calls to github
app.get('/auth/facebook/callback',
passport.authenticate('facebook', { failureRedirect: '/login' }),
function(req, res) {
  // console.log(req)
  console.log(req.user.profile.emails[0].value)
  let displayName = req.user.profile.displayName
  let firstAndLast = displayName.split(' ')
  let first_name = firstAndLast[0]
  let last_name = firstAndLast[1]
  let email = req.user.profile.emails[0].value
  let password = "facebook_user_password"
  // Successful authentication, redirect home.
  // Add new user to knex
  // let newUser = {
  //   first_name: first_name,
  //   last_name: last_name,
  //   email: email,
  //   password: password
  // }

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
  })
  .catch((err) => {
    console.log(err.detail)
    res.status(400)
    res.send(err.detail)
  })
  var string = encodeURIComponent('something that would break');
  res.redirect('http://localhost:3131');
});

app.use(bodyParser.json()); //keep before routes
// app.use(cors());
app.use(morgan('dev'))
app.use(cookieParser());

app.use('/', users);
app.use('/', gyms);
app.use('/', memberships);
app.use('/', dates);
app.use('/', token)


app.use(express.static(path.join(__dirname, 'public')));

app.use((_req, res) => {
res.sendStatus(404);
});


const port = process.env.PORT || 3131; //for deployment
// const port = process.env.PORT || 3000; //for running locally


app.listen(port, () => {
console.log('Listening on port', port);
});

module.exports = app;
