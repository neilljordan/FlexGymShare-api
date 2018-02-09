const express = require('express');
const knex = require('../knex');
const qr = require('qr-image');

const router = express.Router();

// TODO: change the route name from /qrCodes to something like /passes
// generate a QR PNG with embedded URL based on a code
router.get('/qrCodes/:code', (req, res) => {
  const passCode = req.params.code;
  const pngString = qr.imageSync(`${process.env.ORIGIN_HOST}/verification/${passCode}`, { type: 'png' });
  res.send(pngString);
});

// find the daypass record associated with the code
router.get('/qrCodes/verification/:code', (req, res) => {
  const passCode = req.params.code;
  knex('daypass')
    .where('code', passCode)
    .then((rows) => {
      res.json(rows[0]);
    })
    .catch(err => next(err));
});

module.exports = router;
