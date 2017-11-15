exports.seed = function(knex, Promise) {
  return knex('dates').del()
    .then(function () {
      return knex('dates').insert([
        {
        	id:1,
          	membership_id: 1,
            date_available: '10-26-17',
            booked: false
        }
      ])
      .then(()=>{
        return knex.raw("SELECT setval('dates_id_seq', (SELECT MAX(id) FROM dates))")
      })
    })
};
