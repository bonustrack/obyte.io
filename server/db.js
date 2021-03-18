if (!process.env.DATABASE_URL) {
  // eslint-disable-next-line global-require
  require('dotenv').config({ path: `${__dirname}/../.env` });
}
const pgp = require('pg-promise')();

const cn = {
  connectionString: process.env.DATABASE_URL,
  ssl: true,
};
const db = pgp(cn);

module.exports = db;
