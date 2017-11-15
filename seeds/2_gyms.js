exports.seed = function(knex, Promise) {
  return knex('gyms').del()
    .then(function () {
      return knex('gyms').insert([
        {
        	id:1,
          	gym_id: 1,
          	name: 'Colorado Athletic Club',
            address: '2136 19th Street, Boulder CO 80302',
            price : 100.32
        }
      ])
      .then(()=>{
        return knex.raw("SELECT setval('gyms_id_seq', (SELECT MAX(id) FROM gyms))")
      })
    })
};
