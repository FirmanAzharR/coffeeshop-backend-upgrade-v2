const dbConfig = require('../config/config')
const Sequelize = require('sequelize')
const logger = require('../helper/logger')

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
