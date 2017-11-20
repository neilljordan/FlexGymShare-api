exports.up = function(knex, Promise) {
  return knex.schema.createTable('gyms', (table)=>{
    table.increments('id').notNullable()
    table.string('name').notNullable()
    table.string('address').notNullable()
    table.decimal('price').notNullable()
    table.string('image')
    table.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('gyms')
};
