'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const morgan = require('morgan');
const cors = require('cors')
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors())

app.use(express.static(path.join(__dirname, 'public')));

app.use((_req, res) => {
res.sendStatus(404);
});

const port = process.env.PORT || 8081;

app.listen(port, () => {
console.log('Listening on port', port);
});

module.exports = app;
