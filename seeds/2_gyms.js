exports.seed = function(knex, Promise) {
  return knex('gyms').del()
    .then(function () {
      return knex('gyms').insert([
        {
        	  id:1,
          	name: 'One Boulder Fitness',
            description: "ONE Boulder Fitness offers you a cutting-edge Conditioning Center, innovative Group Training and the area’s finest, friendliest Professional Fitness Trainers.  We’re located in the heart of downtown Boulder, with free parking included. Experience the convenience, effectiveness and energy of an OBF workout.",
            hours: "Tuesday	5:30AM–9PM, Wednesday	5:30AM–9PM, Thursday	5:30AM–9PM, Friday	5:30AM–9PM, Saturday	8AM–6PM, Sunday	8AM–6PM, Monday	5:30AM–9PM",
            telephone: 303-625-6881,
            address: '1800 Broadway Suite 190, Boulder CO, 80302',
            blackout: "12/25/2017",
            price : 7,
            image: 'http://96bda424cfcc34d9dd1a-0a7f10f87519dba22d2dbc6233a731e5.r41.cf2.rackcdn.com/oneboulderfitness/logo/ONE-Logo-Tagline-NoRibbon/ONE-Logo-Tagline-NoRibbon_gallery.png'
        },
        {
            id:2,
            name: 'Colorado Athletic Club',
            description: "We are proud to offer our Members the absolute best in fitness and wellness programs, including everything from Pilates, Indoor Cycling, and cutting-edge Group Exercise classes, to Small Group Training with certified fitness professionals. At Colorado Athletic Club-Boulder, we ensure that every Member feels comfortable and has the knowledge to participate. We are happy to offer every new Member two complimentary Personal Coaching Sessions. This is an invaluable opportunity to get advice from an expert, plus learn the correct way to use each piece of equipment. This session is tailored to meet the needs of each individual so please contact our Personal Training Manager to find out more and book your first appointment today. Come in, be inspired.",
            hours: "Monday – Thursday 5AM-10PM, Friday, 5AM – 9PM, Saturday & Sunday 6AM – 8PM",
            telephone: 303-501-1700,
            address: '1821 30th St, Boulder, CO 80301',
            blackout: "Sunday, December 24 | 6AM-1PM, Monday: December 25 | Closed, Sunday: December 31 | 5AM-6PM",
            price : 7,
            image: 'http://www.centennialgunclub.com/wp-content/uploads/2016/01/colorado-athletic-club.png'
        },
        {
            id:3,
            name: '24 Hour Fitness',
            description: "A little fit goes a long way, when you manage to fit in your workout. At 24 Hour Fitness, we’re here to provide the motivation you need to kick off the covers and kick into gear. We put opportunities and tools at your fingertips – such as studio and cycle classes, on-demand workouts, 24Life magazine and signature training programs – to get you started on the right track and keep you moving forward. Headquartered in San Ramon, Calif., we are a leading fitness industry pioneer with nearly four million members in more than 400 clubs across the U.S. For more than 30 years, we’ve held fast to our mission of helping people improve their lives through fitness. From small and large goals met inside our clubs to living better outside the club, we’re here to help you Do More with Your 24.",
            hours: "Monday-Sunday, Open 24 Hours A Day",
            telephone: 303-209-9274,
            blackout: "none",
            address: '2900 Iris Ave, Boulder, CO 80301',
            price : 7,
            image: 'http://www.bsideblog.com/images/2008/06/24HourFitness.jpg'
          }
      ])
      .then(()=>{
        return knex.raw("SELECT setval('gyms_id_seq', (SELECT MAX(id) FROM gyms))")
      })
    })
};
