const router = require('express').Router()
const test = require('./routes/test')
const auth = require('./routes/auth')
const product = require('./routes/product')
const category = require('./routes/category')
const profile = require('./routes/profile')

router.use('/', test)
router.use('/auth', auth)
router.use('/product', product)
router.use('/category', category)
router.use('/profile', profile)

module.exports = router
