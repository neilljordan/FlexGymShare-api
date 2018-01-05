exports.up = function(knex, Promise) {
  return knex.schema.createTable('ledger', (table)=>{
    table.increments('id').primary()
    table.integer('user_id').notNullable().references('users.id').onDelete('CASCADE').index()
    table.integer('listing_id').references('listings.id').onDelete('CASCADE').index()
    table.integer('gym_id').references('gyms.id').onDelete('CASCADE').index()
    table.string('ledger_hash')
    table.date('gym_date').notNullable()
    table.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('ledger')
};
