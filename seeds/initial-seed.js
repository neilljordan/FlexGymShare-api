const userData = require('./data/user');
const gymData = require('./data/gym');
const amenityData = require('./data/amenity');
const listingData = require('./data/listing');
const passTypeData = require('./data/pass_type');
const daypassData = require('./data/daypass');
const transactionData = require('./data/transaction');
const transactionTypeData = require('./data/transaction_type');
const gymAmenitiesData = require('./data/gym_amenities');
const blackoutDatesData = require('./data/blackout_date');
const gymHoursData = require('./data/gym_hours');
const gymConfigData = require('./data/gym_config');
const roleData = require('./data/role');
const visitData = require('./data/visit');

exports.seed = function (knex, Promise) {
  return knex('transaction').del()
    .then(() => knex('customer').del())
    .then(() => knex('charge').del())
    .then(() => knex('visit').del())
    .then(() => knex('daypass').del())
    .then(() => knex('pass_type').del())
    .then(() => knex('blackout_date').del())
    .then(() => knex('listing').del())
    .then(() => knex('gym_amenities').del())
    .then(() => knex('amenity').del())
    .then(() => knex('gym_staff').del())
    .then(() => knex('gym_hours').del())
    .then(() => knex('role').del())
    .then(() => knex('gym').del())
    .then(() => knex('user').del())
    .then(() => knex('gym_config').del())
    .then(() => knex('user').insert(userData))
    .then(() => knex.raw("SELECT setval('user_id_seq', (SELECT COUNT(*) FROM public.user))"))
    .then(() => knex('gym').insert(gymData))
    .then(() => knex.raw("SELECT setval('gym_id_seq', (SELECT COUNT(*) FROM gym))"))
    .then(() => knex('role').insert(roleData))
    .then(() => knex.raw("SELECT setval('role_id_seq', (SELECT COUNT(*) FROM role))"))
    .then(() => knex('gym_hours').insert(gymHoursData))
    .then(() => knex.raw("SELECT setval('gym_hours_id_seq', (SELECT COUNT(*) FROM gym_hours))"))
    .then(() => knex('gym_config').insert(gymConfigData))
    .then(() => knex.raw("SELECT setval('gym_config_id_seq', (SELECT COUNT(*) FROM gym_config))"))
    .then(() => knex('amenity').insert(amenityData))
    .then(() => knex.raw("SELECT setval('amenity_id_seq', (SELECT COUNT(*) FROM amenity))"))
    .then(() => knex('gym_amenities').insert(gymAmenitiesData))
    .then(() => knex('blackout_date').insert(blackoutDatesData))
    .then(() => knex.raw("SELECT setval('blackout_date_id_seq', (SELECT COUNT(*) FROM blackout_date))"))
    .then(() => knex('pass_type').insert(passTypeData))
    .then(() => knex.raw("SELECT setval('pass_type_id_seq', (SELECT COUNT(*) FROM pass_type))"))
    .then(() => knex('transaction_type').insert(transactionTypeData))
    .then(() => knex.raw("SELECT setval('transaction_type_id_seq', (SELECT COUNT(*) FROM transaction_type))"))
    .then(() => knex('transaction').insert(transactionData))
    .then(() => knex.raw("SELECT setval('transaction_id_seq', (SELECT COUNT(*) FROM transaction))"))
    .then(() => knex('listing').insert(listingData))
    .then(() => knex.raw("SELECT setval('listing_id_seq', (SELECT COUNT(*) FROM listing))"))
    .then(() => knex('daypass').insert(daypassData))
    .then(() => knex.raw("SELECT setval('daypass_id_seq', (SELECT COUNT(*) FROM daypass))"))
    .then(() => knex('visit').insert(visitData))
    .then(() => knex.raw("SELECT setval('visit_id_seq', (SELECT COUNT(*) FROM visit))"));
};
