exports.seed = function(knex, Promise) {
  return knex('gyms').del()
    .then(function () {
      return knex('gyms').insert([
        {
        	id:1,
          	name: 'One Boulder Fitness',
            address: '1800 Broadway Suite 190, Boulder CO, 80302',
            price : 100.32,
            image: 'http://96bda424cfcc34d9dd1a-0a7f10f87519dba22d2dbc6233a731e5.r41.cf2.rackcdn.com/oneboulderfitness/logo/ONE-Logo-Tagline-NoRibbon/ONE-Logo-Tagline-NoRibbon_gallery.png'
        }
      ])
      .then(()=>{
        return knex.raw("SELECT setval('gyms_id_seq', (SELECT MAX(id) FROM gyms))")
      })
    })
};
