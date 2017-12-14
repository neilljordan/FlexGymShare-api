exports.up = function(knex, Promise) {
  return knex.schema.createTable('dates', (table)=>{
    table.increments('id').primary()
    table.integer('gym_id').notNullable().references('gyms.id').onDelete('CASCADE').index()
    table.date('blackout_dates')
    table.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('dates')
};
