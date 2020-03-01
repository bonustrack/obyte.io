const pgp = require('pg-promise')();

const db = pgp('postgres://postgres@localhost:5432/obyte_io');

module.exports = db;
