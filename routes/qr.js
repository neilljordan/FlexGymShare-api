'use strict';

const express = require('express');
const knex = require('../knex');
const router = express.Router();
const qr = require('qr-image');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
//qr route;
router.get('/qrCodes/:id', function(req, res){
  let id = req.params.id
  id.replace(new RegExp('>', 'g'), '/')
  let crypted = bcrypt.hashSync(id, salt)
  console.log(crypted)
  var qr_png = qr.image(`http://localhost:3000/verification/${id}`, { type: 'png' });
  qr_png.pipe(require('fs').createWriteStream('validate_session.png'));
  var png_string = qr.imageSync(`http://localhost:3000/verification/${id}`, { type: 'png' });
  res.send(png_string)
})

router.get('/qrCodes/verification/:hash', function(req, res){

  let hash = req.params.hash
  let stuff = hash.replace(new RegExp('>', 'g'), '/')
  console.log('***********************'+stuff)


  knex('ledger')
    .where('ledger_hash', stuff)
    .then((newLedger)=>{
      console.log(newLedger)
      res.json(newLedger[0])
    })
    .catch((err)=>next(err))

  console.log(stuff)

})

module.exports = router;
