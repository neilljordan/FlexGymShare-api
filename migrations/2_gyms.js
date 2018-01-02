exports.up = function(knex, Promise) {
  return knex.schema.createTable('gyms', (table)=>{
    table.increments('id').primary().notNullable()
    table.string('name').notNullable()
    table.text('description').notNullable()
    table.varchar('hours').notNullable()
    table.varchar('telephone').notNullable()
    table.string('address').notNullable()
    table.varchar('blackout')
    // table.enu('ammenities', ['weights', 'cardio', 'sports facilities', 'yoga', 'personal training', 'fitness classes', 'spa', 'pool', 'pilates', 'day care', 'locker rooms', 'parking'])
    table.decimal('price').notNullable()
    table.string('image')
    table.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('gyms')
};
