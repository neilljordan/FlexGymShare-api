exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('user', (table) => {
      table.increments('id').primary().notNullable();
      table.string('first_name').notNullable();
      table.string('last_name').notNullable();
      table.string('email').notNullable().unique();
      table.string('profile_image').defaultTo('');
      table.string('facebook_uid').defaultTo('');
      table.integer('gym_id').references('gym.id').onDelete('CASCADE').index()
        .defaultTo(null);
      table.timestamps(true, true);
    }),
    knex.schema.createTable('gym', (table) => {
      table.increments('id').primary().notNullable();
      table.string('name').notNullable();
      table.text('description').notNullable();
      table.string('hours').notNullable();
      table.string('address').notNullable();
      table.string('telephone').notNullable();
      table.string('website');
      table.decimal('default_price').notNullable();
      table.string('image');
      table.timestamps(true, true);
    }),
    knex.schema.createTable('amenity', (table) => {
      table.increments('id').notNullable();
      table.string('name').notNullable();
      table.timestamps(true, true);
    }),
    knex.schema.createTable('gym_amenities', (table) => {
      table.integer('gym_id').notNullable().references('gym.id').onDelete('CASCADE')
        .index();
      table.integer('amenity_id').notNullable().references('amenity.id').onDelete('CASCADE')
        .index();
      table.timestamps(true, true);
    }),
    knex.schema.createTable('blackout_date', (table) => {
      table.increments('id').primary();
      table.integer('gym_id').notNullable().references('gym.id').onDelete('CASCADE')
        .index();
      table.date('date').notNullable();
      table.timestamps(true, true);
    }),
    knex.schema.createTable('daypass', (table) => {
      table.increments('id').primary();
      table.integer('user_id').notNullable().references('user.id').onDelete('CASCADE')
        .index();
      table.integer('gym_id').notNullable().references('gym.id').onDelete('CASCADE')
        .index();
      table.date('date').notNullable();
      table.timestamps(true, true);
    }),
    knex.schema.createTable('listing', (table) => {
      table.increments('id').primary();
      table.integer('user_id').notNullable().references('user.id').onDelete('CASCADE')
        .index();
      table.integer('gym_id').notNullable().references('gym.id').onDelete('CASCADE')
        .index();
      table.boolean('purchased').defaultTo(false);
      table.date('date');
      table.timestamps(true, true);
    }),
    knex.schema.createTable('transaction', (table) => {
      table.increments('id').primary();
      table.integer('user_id').notNullable().references('user.id').onDelete('CASCADE')
        .index();
      table.integer('listing_id').references('listing.id').onDelete('CASCADE').index();
      table.integer('gym_id').references('gym.id').onDelete('CASCADE').index();
      table.string('hash');
      table.date('gym_date').notNullable();
      table.timestamps(true, true);
    }),
  ]);
  // .return({ created: true })
  // .catch(console.error('ERROR IN SETUP UP'));
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('transaction'),
    knex.schema.dropTableIfExists('gym_amenities'),
    knex.schema.dropTableIfExists('blackout_date'),
    knex.schema.dropTableIfExists('daypass'),
    knex.schema.dropTableIfExists('listing'),
    knex.schema.dropTableIfExists('amenity'),
    knex.schema.dropTableIfExists('gym'),
    knex.schema.dropTableIfExists('user'),
  // .return({ created: true })
  // .catch(console.error('ERROR IN SETUP DOWN'));
  ]);
};