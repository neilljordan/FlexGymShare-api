exports.up = function(knex, Promise) {
  return knex.schema.createTable('gyms', (table)=>{
    table.increments('id').primary()
    table.integer('gym_id').notNullable().references('gyms.id').onDelete('CASCADE').index()
    table.string('name').notNullable()
    table.string('address').notNullable()
    table.decimal('price').notNullable()
    table.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('gyms')
};
