require('dotenv').config()
//====================================SERVER DB LOCAL===============================================//
module.exports = {
    HOST: process.env.HOST,
    USER: process.env.USERNAME,
    PASSWORD: process.env.PASSWORD,
    DB: process.env.DB,
    dialect: process.env.DIALECT,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
