const router = require('express').Router()
const test = require('./routes/test')
const auth = require('./routes/auth')
const product = require('./routes/product')
const category = require('./routes/category')

router.use('/', test)
router.use('/auth', auth)
router.use('/product', product)
router.use('/category', category)

module.exports = router
