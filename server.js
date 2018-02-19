const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');

const users = require('./routes/users');
const gyms = require('./routes/gyms');
const staff = require('./routes/staff');
const passes = require('./routes/passes');
const listings = require('./routes/listings');
const orders = require('./routes/orders');
const qrCodes = require('./routes/qr');
const token = require('./routes/token');
const invites = require('./routes/invites');
const configs = require('./routes/config');
const visits = require('./routes/visits');
const roles = require('./routes/roles');
const payment = require('./routes/payment');

// configure application performance, release, error monitoring tool
const opbeat = require('opbeat').start({
  appId: process.env.OPBEAT_APP_ID,
  organizationId: process.env.OPBEAT_ORG_ID,
  secretToken: process.env.OPBEAT_SECRET_TOKEN,
});

const app = express();
const port = process.env.PORT || 3131; // for deployment
const headerOrigin = process.env.ORIGIN_HOST || 'https://test.flexgymshare.com'; // for deployment

// set the CORS configuration
const corsOptions = {
  allowedHeaders: 'Content-Type, Accept, Authorization',
  credentials: true,
  methods: 'GET,POST,DELETE,PATCH,PUT',
  origin: (origin, callback) =>
    ((headerOrigin.indexOf(origin) !== -1)
      ? callback(null, true)
      : callback(new Error('Not allowed by CORS'))),
};

app.use(cors(corsOptions));
app.use(bodyParser.json()); // keep before routes
app.use(morgan('dev'));
app.use(cookieSession({ secret: 'keyboard cat' }));
app.use(cookieParser());

app.use('/', users);
app.use('/', gyms);
app.use('/', staff);
app.use('/', passes);
app.use('/', listings);
app.use('/', orders);
app.use('/', qrCodes);
app.use('/', token);
app.use('/', invites);
app.use('/', configs);
app.use('/', visits);
app.use('/', roles);
app.use('/', payment);

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
