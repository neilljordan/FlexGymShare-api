exports.seed = function(knex, Promise) {
  return knex('listings').del()
    .then(function () {
      return knex('listings').insert([
        {
        	id: 1,
          user_id: 1,
          gym_id: 1,
          purchased: false,
          date: '1-15-18'
        }
      ])
      .then(()=>{
        return knex.raw("SELECT setval('listings_id_seq', (SELECT MAX(id) FROM listings))")
      })
    })
};
