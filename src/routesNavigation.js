const router = require('express').Router()
const test = require('./routes/test')

router.use('/', test)

module.exports = router