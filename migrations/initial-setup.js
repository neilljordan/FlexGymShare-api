exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('user', (table) => {
      table.comment('All people in the system...buyers, sellers, and gym employees');
      table.increments('id').primary();
      table.string('email').notNullable().unique();
      table.string('first_name').notNullable();
      table.string('last_name').notNullable();
      table.string('facebook_uid').defaultTo('');
      table.string('profile_image').defaultTo('').comment('URL for FB avatar');
      table.integer('gym_id').references('gym.id').onDelete('CASCADE').index()
        .defaultTo(null)
        .comment('The home gym of the user');
      // table.uuid('uuid').defaultTo(knex.raw('uuid_generate_v4()'));
      table.timestamps(true, true);
    }),
    knex.schema.createTable('gym', (table) => {
      table.comment('Specific gym location (i.e. not the chain name)...includes all information provided at signing');
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('slug').unique().notNullable().comment('Unique URL-safe identifier for gym');
      table.string('address').notNullable();
      table.string('telephone');
      table.string('website_link');
      table.string('owner_email').comment('Email address of the account owner');
      table.string('pass_retail_price').comment('The amount the gym charges for drop-ins');
      table.string('image'); // TODO: remove this
      table.timestamps(true, true);
    }),
    knex.schema.createTable('role', (table) => {
      table.comment('Available types of user roles (Owner or Worker)');
      table.increments('id').primary();
      table.string('name').notNullable();
    }),
    knex.schema.createTable('invite', (table) => {
      table.comment('Invite for a gym employee to be associated with the gym in the system');
      table.increments('id').primary();
      table.string('email').notNullable().comment('Email address the invite is sent to');
      table.integer('gym_id').references('gym.id').onDelete('CASCADE').index();
      table.integer('role_id').references('role.id').onDelete('CASCADE');
      table.string('date_sent').notNullable().comment('The date the invite was sent');
      table.integer('sender_id').references('user.id').onDelete('CASCADE');
      table.date('date_accepted').comment('The date the invite was accepted');
      table.integer('acceptor_id').references('user.id').onDelete('CASCADE');
      table.string('code').notNullable().comment('The code used to accept the invite');
      table.string('status').comment('A one-word status for the invite');
      table.timestamps(true, true);
    }),
    knex.schema.createTable('gym_config', (table) => {
      table.comment('Gym-specific overrides of default settings');
      table.increments('id').primary();
      table.integer('gym_id').references('gym.id').onDelete('CASCADE').index();
      table.string('name').notNullable().comment('The name of the setting (matching the config file)');
      table.string('value', 800).notNullable().comment('The value of the setting');
      table.timestamps(true, true);
    }),
    knex.schema.createTable('gym_staff', (table) => {
      table.comment('Associates (employee) users with gyms');
      table.increments('id').primary();
      table.integer('gym_id').references('gym.id').onDelete('CASCADE').index();
      table.integer('user_id').references('user.id').onDelete('CASCADE');
      table.integer('role_id').references('role.id').onDelete('CASCADE');
      table.timestamps(true, true);
    }),
    knex.schema.createTable('gym_hours', (table) => {
      table.comment('Opening and off-peak hours for a gym by day of the week');
      table.increments('id').primary();
      table.integer('gym_id').references('gym.id').onDelete('CASCADE').index();
      table.integer('day_of_week').notNullable();
      table.boolean('is_off_peak').notNullable().defaultTo(false);
      table.time('start_time').notNullable();
      table.time('end_time').notNullable();
      table.timestamps(true, true);
    }),
    knex.schema.createTable('amenity', (table) => {
      table.comment('Amenities that can be offered by gyms');
      table.increments('id').primary();
      table.string('name').notNullable();
      table.timestamps(true, true);
    }),
    knex.schema.createTable('gym_amenities', (table) => {
      table.comment('Association between gyms and amenities');
      table.integer('gym_id').notNullable().references('gym.id').onDelete('CASCADE')
        .index();
      table.integer('amenity_id').notNullable().references('amenity.id').onDelete('CASCADE')
        .index();
      table.timestamps(true, true);
    }),
    knex.schema.createTable('blackout_date', (table) => {
      table.comment('Days that a gym is completely closed');
      table.increments('id').primary();
      table.integer('gym_id').notNullable().references('gym.id').onDelete('CASCADE')
        .index();
      table.date('date').notNullable();
      table.timestamps(true, true);
    }),
    knex.schema.createTable('pass_type', (table) => {
      table.comment('The available types of gym passes in the system (Anytime or Off-Peak)');
      table.increments('id').primary();
      table.string('name').notNullable();
      table.timestamps(true, true);
    }),
    knex.schema.createTable('listing', (table) => {
      table.comment('A pass that allows a user to visit a gym');
      table.increments('id').primary();
      table.integer('lister_id').notNullable().references('user.id').onDelete('CASCADE')
        .index()
        .comment('The person who listed the pass');
      table.integer('gym_id').notNullable().references('gym.id').onDelete('CASCADE')
        .index();
      table.date('date').notNullable()
        .comment('The date the pass is listed for');
      table.integer('renter_id').references('user.id').onDelete('CASCADE').defaultTo(null)
        .index()
        .comment('The person who rented the pass');
      table.integer('transaction_id').references('transaction.id')
        .onDelete('CASCADE')
        .comment('The transaction that purchased the listing (null until it was bought)');
      table.timestamps(true, true);
    }),
    knex.schema.createTable('daypass', (table) => {
      table.comment('A pass that allows a user to visit a gym');
      table.increments('id').primary();
      table.integer('user_id').references('user.id')
        .notNullable()
        .onDelete('CASCADE')
        .index()
        .comment('The user who purchased the pass');
      table.integer('gym_id').references('gym.id')
        .notNullable()
        .onDelete('CASCADE')
        .index()
        .comment('The gym where the pass can be used');
      table.integer('pass_type_id').references('pass_type.id')
        .notNullable()
        .defaultTo(1)
        .onDelete('CASCADE');
      table.integer('transaction_id').references('transaction.id')
        .onDelete('CASCADE')
        .comment('A link to the transaction where the pass was purchased');
      table.string('code')
        .notNullable()
        .comment('The code to be used to redeem the pass');
      table.date('date')
        .notNullable()
        .comment('The date for which the pass is valid');
      table.timestamps(true, true);
    }),
    knex.schema.createTable('visit', (table) => {
      table.comment('A record that a user successfully visited a gym');
      table.increments('id').primary();
      table.integer('renter_id').notNullable().references('user.id').onDelete('CASCADE')
        .index()
        .comment('The user who rented the pass and visited the gym');
      table.integer('worker_id').notNullable().references('user.id').onDelete('CASCADE')
        .index()
        .comment('The employee who checked in the user and authorized the visit');
      table.integer('gym_id').notNullable().references('gym.id').onDelete('CASCADE')
        .index();
      table.integer('daypass_id').notNullable().references('daypass.id').onDelete('CASCADE')
        .comment('The daypass that was used for the visit');
      table.date('date').notNullable()
        .comment('The date the visit took place');
      table.text('notes');
      table.timestamps(true, true);
    }),
    knex.schema.createTable('transaction_type', (table) => {
      table.comment('The available types of transactions in the system (Sale or Purchase)');
      table.increments('id').primary();
      table.string('name').notNullable();
      table.timestamps(true, true);
    }),
    knex.schema.createTable('transaction', (table) => {
      table.comment('A ledger of all financial transactions in the system');
      table.increments('id').primary();
      table.date('date').notNullable();
      table.decimal('amount', 8, 2).notNullable();
      table.integer('user_id').notNullable().references('user.id').onDelete('CASCADE')
        .index();
      table.integer('gym_id').references('gym.id').onDelete('CASCADE').index();
      table.integer('transaction_type_id').references('transaction_type.id').onDelete('CASCADE').index();
      table.integer('pass_type_id').notNullable().references('pass_type.id').onDelete('CASCADE')
        .defaultTo(1);
      table.integer('linked_transaction_id').references('transaction.id')
        .comment('For sell transactions...points to the purchase transaction');
      table.string('comment');
      table.timestamps(true, true);
    }),
  ]);
  // .return({ created: true })
  // .catch(console.error('ERROR IN SETUP UP'));
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('visit'),
    knex.schema.dropTableIfExists('daypass'),
    knex.schema.dropTableIfExists('gym_amenities'),
    knex.schema.dropTableIfExists('gym_config'),
    knex.schema.dropTableIfExists('blackout_date'),
    knex.schema.dropTableIfExists('gym_hours'),
    knex.schema.dropTableIfExists('gym_staff'),
    knex.schema.dropTableIfExists('amenity'),
    knex.schema.dropTableIfExists('invite'),
    knex.schema.dropTableIfExists('role'),
    knex.schema.dropTableIfExists('listing'),
    knex.schema.dropTableIfExists('transaction'),
    knex.schema.dropTableIfExists('transaction_type'),
    knex.schema.dropTableIfExists('pass_type'),
    knex.schema.dropTableIfExists('user'),
    knex.schema.dropTableIfExists('gym'),
  // .return({ created: true })
  // .catch(console.error('ERROR IN SETUP DOWN'));
  ]);
};
