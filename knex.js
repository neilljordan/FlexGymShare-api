const environment = process.env.NODE_ENV || 'development';
const knexConfig = require('./knexfile')[environment];
const pg = require('pg');

if (environment !== 'development') pg.defaults.ssl = true;
const knex = require('knex')(knexConfig);

module.exports = knex;
