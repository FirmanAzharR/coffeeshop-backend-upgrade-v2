const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('passport')
const logger = require('./src/helper/logger')
const db = require('./src/models')
const cookieSession = require('cookie-session')

require('dotenv').config()

const routesNavigation = require('./src/routesNavigation')

const app = express()

app.use(passport.initialize())
app.use(bodyParser.json({ limit: '10mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

db.sequelize
    .sync({ alter: true })
    .then(() => {
        logger.info('check and update table when model are updated')
    })
    .then(() => {
        logger.info('proses sync db done')
        logger.info('running app successfully')
    })
    .catch((e) => {
        logger.info('failed sync database', e)
    })

// drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//     console.log('Drop and re-sync db.')
// })

app.use(cors())
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    // response.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5000/')
    response.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Request-With, Content-Type, Authorization'
    )
    next()
})
app.use('/api1', routesNavigation)
app.use('/api1/fileUploadsApi1', express.static('upload'))

app.get('/', (req, res) => {
    res.status(200).send({message: "Express API is running"})
})

// app.use('/', routesNavigation)
app.get('*', (req, res) => {
    res.status(404).send('Path not found')
})

const port = process.env.PORT || 8080

app.listen(port,"0.0.0.0", () => {
    logger.info(`app is running on port ${port}`)
})
