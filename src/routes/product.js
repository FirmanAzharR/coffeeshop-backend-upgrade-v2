const router = require('express').Router()
module.exports = router

const { addProduct } = require('../controllers/product')

router.post('/product-add', addProduct)
