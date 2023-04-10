const {Client} = require('pg');

const connectionString = process.env.DATABASE_URL || 'https://postgres:password@localhost:6543/fitness-dev';

const client = new Client({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});
 
module.exports = client;
