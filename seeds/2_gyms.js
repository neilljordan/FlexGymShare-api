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
        },
        {
            id:2,
              name: 'Colorado Athletic Club',
            address: '1821 30th St, Boulder, CO 80301',
            price : 155.19
            image: 'http://www.centennialgunclub.com/wp-content/uploads/2016/01/colorado-athletic-club.png'
        },
        {
        id:3,
              name: '24 Hour Fitness',
            address: '2900 Iris Ave, Boulder, CO 80301',
            price : 54.19
            image: 'http://www.bsideblog.com/images/2008/06/24HourFitness.jpg'
          }
      ])
      .then(()=>{
        return knex.raw("SELECT setval('gyms_id_seq', (SELECT MAX(id) FROM gyms))")
      })
    })
};
