const { Client } = require('pg');

const connectDB = async () => {
  const client = new Client({
    connectionString: process.env.POSTGRES_URI,
  });

  try {
    await client.connect();
    console.log('PostgreSQL Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
