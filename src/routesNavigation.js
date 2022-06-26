const router = require('express').Router()
const test = require('./routes/test')
const auth = require('./routes/auth')
const product = require('./routes/product')

router.use('/', test)
router.use('/auth', auth)
router.use('/product', product)


module.exports = router
