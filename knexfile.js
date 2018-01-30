module.exports = {
  development: {
    client: 'pg',
    debug: true,
    connection: process.env.DATABASE_URL,
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
  },
};
