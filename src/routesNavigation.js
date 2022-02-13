const router = require('express').Router()
const test = require('./routes/test')
const auth = require('./routes/auth')

router.use('/', test)
router.use('/auth', auth)

module.exports = router
