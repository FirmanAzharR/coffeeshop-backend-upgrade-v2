require('dotenv').config()

// module.exports = {
//     HOST: process.env.HOST,
//     USER: process.env.USERNAME,
//     PASSWORD: process.env.PASSWORD,
//     DB: process.env.DB,
//     dialect: process.env.DIALECT,
//     pool: {
//       max: 5,
//       min: 0,
//       acquire: 30000,
//       idle: 10000
//     }
//   };

module.exports = {
    HOST: 'ec2-35-153-35-94.compute-1.amazonaws.com',
    USER: 'apmiutvjayhflf',
    PASSWORD:
        '79acee2e6ce09163e01b09cc8dce1454f5151cd228f2a883ba2c484bbe7a4d4c',
    DB: 'ddl8qtpvr02hja',
    dialect: 'postgres',
    ssl: true,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
}
