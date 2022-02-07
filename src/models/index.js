const Sequelize = require('sequelize')
const logger = require('../helper/logger')
const dbConfig = require('../config/config')
//===================== LOCAL CONNECTION ==========================================//
//const dbConfig = require('../config/config')
//const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
// host: dbConfig.HOST,
// dialect: dbConfig.dialect,
// logging: false,
// //operatorsAliases: false,
// pool: {
//     max: dbConfig.pool.max,
//     min: dbConfig.pool.min,
//     acquire: dbConfig.pool.acquire,
//     idle: dbConfig.pool.idle,
// },
//})
//==========================END LOCAL CONNECTIOM====================================//

const sequelize = new Sequelize(
    'postgres://apmiutvjayhflf:79acee2e6ce09163e01b09cc8dce1454f5151cd228f2a883ba2c484bbe7a4d4c@ec2-35-153-35-94.compute-1.amazonaws.com:5432/ddl8qtpvr02hja',
    {
        logging: false,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle,
        },
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    }
)

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

module.exports = db
