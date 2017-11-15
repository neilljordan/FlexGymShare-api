exports.up = function(knex, Promise) {
  return knex.schema.createTable('dates', (table)=>{
    table.increments('id').primary()
    table.integer('membership_id').notNullable().references('memberships.id').onDelete('CASCADE').index()
    table.date('date_available').notNullable()
    table.boolean('booked').notNullable().defaultTo(false)
    table.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('dates')
};
