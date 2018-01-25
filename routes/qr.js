const express = require('express');
const knex = require('../knex');
const qr = require('qr-image');
const bcrypt = require('bcrypt');

const router = express.Router();
const salt = bcrypt.genSaltSync(10);

// TODO: change the route name from /qrCodes to something like /passes
// generate a QR PNG with embedded URL based on a hash
router.get('/qrCodes/:hash', (req, res) => {
  const qrHash = req.params.hash;
  qrHash.replace(new RegExp('>', 'g'), '/');
  // const crypted = bcrypt.hashSync(qrId, salt);
  // const qrPng = qr.image(`https://test.flexgymshare.com/verification/${id}`, { type: 'png' });
  // qrPng.pipe(require('fs').createWriteStream('validate_session.png'));
  // TODO: replace hard-coded URL with a configuration setting
  const pngString = qr.imageSync(`https://test.flexgymshare.com/verification/${qrHash}`, { type: 'png' });
  res.send(pngString);
});

// find the transaction record associated with a hash
router.get('/qrCodes/verification/:hash', (req, res) => {
  const transactionHash = req.params.hash.replace(new RegExp('>', 'g'), '/');

  knex('transaction')
    .where('hash', transactionHash)
    .then((newTransaction) => {
      res.json(newTransaction[0]);
    })
    .catch(err => next(err));
});

module.exports = router;
