exports.seed = function(knex, Promise) {
  return knex('ledger').del()
    .then(function () {
      return knex('ledger').insert([
        {
        	id: 1,
          user_id: 1,
          listing_id: null,
          ledger_hash: 'sk345kjh345kjl34',
          gym_id: 1,
          gym_date: '1-30-18'
        }
      ])
      .then(()=>{
        return knex.raw("SELECT setval('ledger_id_seq', (SELECT MAX(id) FROM ledger))")
      })
    })
};