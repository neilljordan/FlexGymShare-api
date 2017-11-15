'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const morgan = require('morgan');
const cors = require('cors')
const path = require('path');

const users = require('./routes/users');
app.use(bodyParser.json()); //keep before routes

app.use('/', users);

app.use(cors());
app.use(morgan('dev'))
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



app.use(express.static(path.join(__dirname, 'public')));

app.use((_req, res) => {
res.sendStatus(404);
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
console.log('Listening on port', port);
});

module.exports = app;
