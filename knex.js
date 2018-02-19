const environment = process.env.NODE_ENV || 'development';
const pg = require('pg');

if (environment !== 'development') pg.defaults.ssl = true;

const knexConfig = require('./knexfile')[environment];
const knex = require('knex')(knexConfig);

module.exports = knex;
