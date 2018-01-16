exports.up = function(knex, Promise) {
  return knex.schema.createTable('gyms', (table)=>{
    table.increments('id').primary().notNullable()
    table.string('name').notNullable()
    table.text('description').notNullable()
    table.string('hours').notNullable()
    table.string('telephone').notNullable()
    table.string('address').notNullable()
    table.string('website')
    table.string('blackout')
    table.decimal('price').notNullable()
    table.string('image')
    table.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('gyms')
};
