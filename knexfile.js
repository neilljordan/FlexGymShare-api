module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/flex_dev'
    },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
    },

};
