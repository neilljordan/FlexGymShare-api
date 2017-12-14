exports.seed = function(knex, Promise) {
  return knex('dates').del()
    .then(function () {
      return knex('dates').insert([
        {
        	id:1,
          	gym_id: 1,
            blackout_dates: '12-25-17'
        }
      ])
      .then(()=>{
        return knex.raw("SELECT setval('dates_id_seq', (SELECT MAX(id) FROM dates))")
      })
    })
};
