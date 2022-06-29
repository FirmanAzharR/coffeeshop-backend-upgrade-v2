const Sequelize = require('sequelize')
const logger = require('../helper/logger')

//===================== LOCAL CONNECTION ==========================================//
const dbConfig = require('../config/config')
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    logging: false,
    //operatorsAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
    },
})
//=======================================END LOCAL CONNECTION====================================//

//==========================SERVER CONNECTIO HEROKU POSTGRES====================================//
// const sequelize = new Sequelize(
//     'postgres://ipjhrdpibjjoox:ccd569bb5a189942de1f43b17e94b5401d74c82df031ac6a7db3eb57d9d14a58@ec2-34-233-157-189.compute-1.amazonaws.com:5432/ddro6b234k5m5e',
//     {
//         logging: false,
//         pool: {
//             max: dbConfig.pool.max,
//             min: dbConfig.pool.min,
//             acquire: dbConfig.pool.acquire,
//             idle: dbConfig.pool.idle,
//         },
//         dialectOptions: {
//             ssl: {
//                 require: true,
//                 rejectUnauthorized: false,
//             },
//         },
//     }
// )
//==========================END SERVER CONNECTIO HEROKU POSTGRES====================================//

sequelize
    .authenticate()
    .then(() => logger.info('database success connected'))
    .catch((e) => {
        logger.info('database failed to connect', e)
    })

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

db.test = require('./test.model')(sequelize, Sequelize)
db.user = require('./user.model')(sequelize, Sequelize)
db.product = require('./product.model')(sequelize, Sequelize)
db.category = require('./category.model')(sequelize, Sequelize)
db.profile = require('./profile.model')(sequelize, Sequelize)

module.exports = db
