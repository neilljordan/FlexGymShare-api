module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    debug: true,
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
  },
};
