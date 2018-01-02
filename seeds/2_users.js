exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return knex('users').insert([
        {
        	id:1,
          	first_name:'That',
          	last_name:'Oneguy',
            email: "jesus@gmail.com",
            stars: 5,
            comments: '',
            hashed_password:'asdf',
            profile_image: ''
            // token:'',
            // fb_user: ''
        }
      ])
      .then(()=>{
        return knex.raw("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))")
      })
    })
};
