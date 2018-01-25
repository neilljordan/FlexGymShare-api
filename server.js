const express = require('express');

const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const users = require('./routes/users');
const gyms = require('./routes/gyms');
const daypasses = require('./routes/daypasses');
const listings = require('./routes/listings');
const transactions = require('./routes/transactions');
const qrCodes = require('./routes/qr');
const token = require('./routes/token');

const qr = require('qr-image');
const fs = require('fs');
const bcrypt = require('bcrypt');
const knex = require('./knex');

const salt = bcrypt.genSaltSync(10);
const cookieSession = require('cookie-session');

// set up some basic security stuff
const headerOrigin = process.env.ORIGIN_HOST || 'https://test.flexgymshare.com'; // for deployment

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', headerOrigin); // for running locally
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,PATCH,PUT');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
  next();
});

app.use(cookieSession({ secret: 'keyboard cat' }));

app.use(bodyParser.json()); // keep before routes
// app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());

app.use('/', users);
app.use('/', gyms);
app.use('/', daypasses);
app.use('/', listings);
app.use('/', transactions);
app.use('/', qrCodes);
app.use('/', token);

app.use(express.static(path.join(__dirname, 'public')));

app.use((_req, res) => {
  res.sendStatus(404);
});

const port = process.env.PORT || 3131; // for deployment

// for qr codes
// const qr_svg = qr.image('I love QR!', { type: 'svg' });
// qr_svg.pipe(require('fs').createWriteStream('i_love_qr.svg'));
// const svg_string = qr.imageSync('I love QR!', { type: 'svg' });

// log some info to console after starting
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

console.log(`Allowed origin: ${headerOrigin}`);
console.log(`Node configuration: ${process.env.NODE_ENV}`);
console.log(`Node version: ${process.version}`);

module.exports = app;
