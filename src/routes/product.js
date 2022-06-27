const router = require('express').Router()
module.exports = router

const {
    addProduct,
    viewProduct,
    getProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/product')

router.post('/product-add', addProduct)
router.post('/product-view', viewProduct)
router.post('/product-get-page', getProduct)
router.patch('/product-update', updateProduct)
router.delete('/product-delete', deleteProduct)
