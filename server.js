const express = require('express');
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
const invites = require('./routes/invites');
const staff = require('./routes/staff')
const configs = require('./routes/config')
const opbeat = require('opbeat').start({
  appId: 'a7b22c4b09',
  organizationId: '8e92995e0b274928af1aebf18e10357c',
  secretToken: 'a31263fb85fab9c8155cca0807914c0c884f4b04',
});

const app = express();
const cookieSession = require('cookie-session');

const port = process.env.PORT || 3131; // for deployment

// set up some basic security stuff...only calls from ORIGIN HOST are allowed
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
app.use('/', invites);
app.use('/', staff)
app.use('/', configs)

app.use(express.static(path.join(__dirname, 'public')));

app.use((_req, res) => {
  res.sendStatus(404);
});

app.use(opbeat.middleware.express());

// log some info to console after starting
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
console.log(`Allowed origin: ${headerOrigin}`);
console.log(`Node configuration: ${process.env.NODE_ENV}`);
console.log(`Node version: ${process.version}`);

module.exports = app;
