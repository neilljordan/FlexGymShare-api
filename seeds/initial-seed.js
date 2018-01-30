const userData = require('./data/user');
const gymData = require('./data/gym');
const amenityData = require('./data/amenity');
const listingData = require('./data/listing');
const transactionData = require('./data/transaction');
const gymAmenitiesData = require('./data/gym_amenities');
const blackoutDatesData = require('./data/blackout_date');
const gymHoursData = require('./data/gym_hours');

exports.seed = function (knex, Promise) {
  return knex('transaction').del()
    .then(() => knex('blackout_date').del())
    .then(() => knex('listing').del())
    .then(() => knex('gym_amenities').del())
    .then(() => knex('amenity').del())
    .then(() => knex('gym_hours').del())
    .then(() => knex('gym').del())
    .then(() => knex('user').del())
    .then(() => knex('user').insert(userData))
    .then(() => knex.raw("SELECT setval('user_id_seq', (SELECT COUNT(*) FROM public.user))"))
    .then(() => knex('gym').insert(gymData))
    .then(() => knex.raw("SELECT setval('gym_id_seq', (SELECT COUNT(*) FROM gym))"))
    .then(() => knex('gym_hours').insert(gymHoursData))
    .then(() => knex.raw("SELECT setval('gym_hours_id_seq', (SELECT COUNT(*) FROM gym_hours))"))
    .then(() => knex('amenity').insert(amenityData))
    .then(() => knex.raw("SELECT setval('amenity_id_seq', (SELECT COUNT(*) FROM amenity))"))
    .then(() => knex('gym_amenities').insert(gymAmenitiesData))
    .then(() => knex('listing').insert(listingData))
    .then(() => knex.raw("SELECT setval('listing_id_seq', (SELECT COUNT(*) FROM listing))"))
    .then(() => knex('blackout_date').insert(blackoutDatesData))
    .then(() => knex.raw("SELECT setval('blackout_date_id_seq', (SELECT COUNT(*) FROM blackout_date))"))
    .then(() => knex('transaction').insert(transactionData))
    .then(() => knex.raw("SELECT setval('transaction_id_seq', (SELECT COUNT(*) FROM transaction))"));
};
