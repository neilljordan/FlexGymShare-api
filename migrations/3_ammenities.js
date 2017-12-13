exports.up = function(knex, Promise) {
  return knex.schema.createTable('ammenities', (table)=>{
    table.increments('id').notNullable()
    table.integer('gym_id').notNullable().references('gyms.id').onDelete('CASCADE').index()
    table.boolean('cardio').notNullable()
    table.boolean('weight_room').notNullable()
    table.boolean('yoga').notNullable()
    table.boolean('tennis').notNullable()
    table.boolean('racketball').notNullable()
    table.boolean('basketball').notNullable()
    table.boolean('pool').notNullable()
    table.boolean('spa').notNullable()
    table.boolean('parking').notNullable()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('ammenities')
};
