exports.seed = function(knex, Promise) {
  return knex('memberships').del()
    .then(function () {
      return knex('memberships').insert([
        {
        	id:1,
          	user_id: 1,
            gym_id: 1
        }
      ])
      .then(()=>{
        return knex.raw("SELECT setval('memberships_id_seq', (SELECT MAX(id) FROM memberships))")
      })
    })
};
