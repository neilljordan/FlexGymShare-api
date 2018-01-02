exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', (table)=>{
    table.increments('id').primary().notNullable()
    table.string('first_name').notNullable()
    table.string('last_name').notNullable()
    table.string('email').notNullable().unique()
    table.integer('stars').notNullable().defaultTo(5)
    table.string('comments').defaultTo('')
    table.specificType('hashed_password', 'char(60)').notNullable()
    table.string('profile_image').defaultTo('')
    table.string('facebookUID').defaultTo('')
    // table.integer('gym_id').references('gyms.id').onDelete('CASCADE').index()
    // table.string('token').notNullable().unique()
    // table.string('fb_user').notNullable().unique()
    table.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
};
