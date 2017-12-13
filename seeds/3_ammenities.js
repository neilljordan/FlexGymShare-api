exports.seed = function(knex, Promise) {
  return knex('ammenities').del()
    .then(function () {
      return knex('ammenities').insert([
      {
      id: 1,
      gym_id: 1,
      cardio: true,
      weight_room: true,
      yoga: true,
      tennis: false,
      racketball: false,
      basketball: false,
      pool: false,
      spa: true,
      parking: true
      },
      {
      id: 2,
      gym_id: 2,
      cardio: true,
      weight_room: true,
      yoga: true,
      tennis: false,
      racketball: false,
      basketball: false,
      pool: true,
      spa: false,
      parking: true

      },
      {
      id: 3,
      gym_id: 3,
      cardio: true,
      weight_room: true,
      yoga: true,
      tennis: false,
      racketball: false,
      basketball: true,
      pool: true,
      spa: true,
      parking: true
      }

      ])
      .then(()=>{
        return knex.raw("SELECT setval('ammenities_id_seq', (SELECT MAX(id) FROM ammenities))")
      })
    })
};
