const userData = require('./data/user');
const gymData = require('./data/gym');
const amenityData = require('./data/amenity');
const listingData = require('./data/listing');
const transactionData = require('./data/transaction');
const gymAmenitiesData = require('./data/gym_amenities');
const blackoutDatesData = require('./data/blackout_date');

exports.seed = function (knex, Promise) {
  return knex('transaction').del()
    .then(() => knex('listing').del())
    .then(() => knex('gym_amenities').del())
    .then(() => knex('amenity').del())
    .then(() => knex('gym').del())
    .then(() => knex('user').del())
    .then(() => knex('user').insert(userData))
    .then(() => knex('gym').insert(gymData))
    .then(() => knex('amenity').insert(amenityData))
    .then(() => knex('gym_amenities').insert(gymAmenitiesData))
    .then(() => knex('listing').insert(listingData))
    .then(() => knex('blackout_date').insert(blackoutDatesData))
    .then(() => knex('transaction').insert(transactionData))
    .catch(console.error('ERROR IN SEED'));
};
