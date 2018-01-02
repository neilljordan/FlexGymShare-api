exports.up = function(knex, Promise) {
  return knex.schema.createTable('listings', (table)=>{
    table.increments('id').primary()
    table.integer('user_id').notNullable().references('users.id').onDelete('CASCADE').index()
    table.integer('gym_id').notNullable().references('gyms.id').onDelete('CASCADE').index()
    table.boolean('purchased').defaultTo(false)
    table.date('date')
    table.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('listings')
};
