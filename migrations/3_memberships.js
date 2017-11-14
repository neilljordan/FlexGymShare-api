exports.up = function(knex, Promise) {
  return knex.schema.createTable('memberships', (table)=>{
    table.increments('id').notNullable()
    table.integer('user_id').notNullable().references('users.id').onDelete('CASCADE').index()
    table.integer('gym_id').notNullable().references('gyms.id').onDelete('CASCADE').index()
    table.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('memberships')
};
