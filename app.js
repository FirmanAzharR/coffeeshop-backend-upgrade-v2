const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const logger = require('./src/helper/logger')
const db = require("./src/models");

require('dotenv').config()

const routesNavigation = require('./src/routesNavigation')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


db.sequelize.sync({ alter: true });
// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

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

// app.use('/', routesNavigation)
app.get('*', (req, res) => {
  res.status(404).send('Path not found')
})

const port = process.env.PORT

app.listen(port, () => {
  logger.info(`app is running on port ${port}`)
})