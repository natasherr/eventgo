const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true,
        // This reads the ca.pem file we placed in the server folder
        ca: fs.readFileSync(path.join(__dirname, '../../', process.env.DB_SSL_CA)).toString(),
      },
    },
  }
);

module.exports = sequelize;