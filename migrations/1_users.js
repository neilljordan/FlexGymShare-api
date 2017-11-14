exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', (table)=>{
    table.increments('id').notNullable()
    table.string('first_name').notNullable()
    table.string('last_name').notNullable()
    table.string('email').notNullable().unique()
    table.integer('start').notNullable().defaultTo(5)
    table.string('comments')
    table.specificType('hashed_password', 'char(60)').notNullable()
    table.string('token').notNullable().unique()
    table.string('fb_user').notNullable().unique()
    table.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
};
