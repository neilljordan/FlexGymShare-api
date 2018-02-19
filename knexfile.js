module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
  },
  production: {
    client: 'pg',
    connection: `${process.env.DATABASE_URL}?ssl=true`, // force the use of SSL connections via query string
  },
};
