exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('user', (table) => {
      table.increments('id').primary();
      table.string('facebook_uid').defaultTo('');
      table.string('email').notNullable().unique();
      table.string('first_name').notNullable();
      table.string('last_name').notNullable();
      table.string('profile_image').defaultTo('');
      table.integer('gym_id').references('gym.id').onDelete('CASCADE').index()
        .defaultTo(null);
      // table.uuid('uuid').defaultTo(knex.raw('uuid_generate_v4()'));
      table.timestamps(true, true);
    }),
    knex.schema.createTable('gym_staff', (table) => {
      table.increments('id').primary();
      table.increments('gym_id').references('gym.id').onDelete('CASCADE').index();
      table.increments('user_id').references('user.id').onDelete('CASCADE').index();
      table.increments('role_id').references('role.id').onDelete('CASCADE').index();
    }),
    knex.schema.createTable('role', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
    })
    knex.schema.createTable('gym', (table) => {
      table.increments('id').primary();
      table.string('slug').unique().notNullable();
      table.string('name').notNullable();
      table.text('description').notNullable();
      table.string('address').notNullable();
      table.string('telephone').notNullable();
      table.string('website_link');
      table.string('schedule_link');
      table.string('facebook_handle');
      table.decimal('default_price').notNullable();
      table.decimal('off_peak_price');
      table.string('image');
      table.timestamps(true, true);
    }),
    knex.schema.createTable('gym_hours', (table) => {
      table.increments('id').primary();
      table.integer('gym_id').references('gym.id').onDelete('CASCADE').index();
      table.integer('day_of_week').notNullable();
      table.boolean('is_off_peak').notNullable().defaultTo(false);
      table.time('start_time').notNullable();
      table.time('end_time').notNullable();
    }),
    knex.schema.createTable('amenity', (table) => {
      table.increments('id').primary();
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
    knex.schema.createTable('listing', (table) => {
      table.increments('id').primary();
      table.integer('lister_id').notNullable().references('user.id').onDelete('CASCADE')
        .index();
      table.integer('renter_id').references('user.id').onDelete('CASCADE').defaultTo(null)
        .index();
      table.integer('gym_id').notNullable().references('gym.id').onDelete('CASCADE')
        .index();
      table.boolean('is_purchased').defaultTo(false);
      table.date('date').notNullable();
      table.timestamps(true, true);
    }),
    knex.schema.createTable('pass_type', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.timestamps(true, true);
    }),
    knex.schema.createTable('daypass', (table) => {
      table.increments('id').primary();
      table.integer('user_id').notNullable().references('user.id').onDelete('CASCADE')
        .index();
      table.integer('gym_id').notNullable().references('gym.id').onDelete('CASCADE')
        .index();
      table.integer('pass_type_id').notNullable().references('pass_type.id').onDelete('CASCADE')
        .index()
        .defaultTo(1);
      table.date('date').notNullable();
      table.timestamps(true, true);
    }),
    knex.schema.createTable('transaction', (table) => {
      table.increments('id').primary();
      table.integer('user_id').notNullable().references('user.id').onDelete('CASCADE')
        .index();
      table.integer('listing_id').references('listing.id').onDelete('CASCADE').index();
      table.integer('gym_id').references('gym.id').onDelete('CASCADE').index();
      table.integer('pass_type_id').notNullable().references('pass_type.id').onDelete('CASCADE')
        .index()
        .defaultTo(1);
      table.date('pass_date').notNullable();
      table.string('code');
      table.timestamps(true, true);
    }),
  ]);
  // .return({ created: true })
  // .catch(console.error('ERROR IN SETUP UP'));
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('transaction'),
    knex.schema.dropTableIfExists('daypass'),
    knex.schema.dropTableIfExists('pass_type'),
    knex.schema.dropTableIfExists('gym_amenities'),
    knex.schema.dropTableIfExists('blackout_date'),
    knex.schema.dropTableIfExists('listing'),
    knex.schema.dropTableIfExists('amenity'),
    knex.schema.dropTableIfExists('user'),
    knex.schema.dropTableIfExists('gym_hours'),
    knex.schema.dropTableIfExists('gym'),
    knex.schema.dropTableIfExists('gym_staff'),
    knex.schema.dropTableIfExists('role'),
  // .return({ created: true })
  // .catch(console.error('ERROR IN SETUP DOWN'));
  ]);
};
