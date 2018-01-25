const express = require('express');
const knex = require('../knex');
const qr = require('qr-image');
const bcrypt = require('bcrypt');

const router = express.Router();
const salt = bcrypt.genSaltSync(10);

router.get('/qrCodes/:id', (req, res) => {
  const qrId = req.params.id;
  qrId.replace(new RegExp('>', 'g'), '/');
  const crypted = bcrypt.hashSync(qrId, salt);
  const qrPng = qr.image(`https://test.flexgymshare.com/verification/${id}`, { type: 'png' });
  qrPng.pipe(require('fs').createWriteStream('validate_session.png'));
  const pngString = qr.imageSync(`https://test.flexgymshare.com/verification/${id}`, { type: 'png' });
  res.send(pngString);
});

router.get('/qrCodes/verification/:hash', (req, res) => {
  const hash = req.params.hash;
  const stuff = hash.replace(new RegExp('>', 'g'), '/');

  knex('ledger')
    .where('ledger_hash', stuff)
    .then((newLedger) => {
      res.json(newLedger[0]);
    })
    .catch(err => next(err));
});

module.exports = router;
