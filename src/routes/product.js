const router = require('express').Router()
module.exports = router

const {
    addProduct,
    selectProduct,
    getProduct,
} = require('../controllers/product')

router.post('/product-add', addProduct)
router.post('/product-select', selectProduct)
router.post('/product-get-page', getProduct)
