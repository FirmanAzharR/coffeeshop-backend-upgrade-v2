const router = require('express').Router()
const { isAuth, isAdmin } = require('../middleware/authorization')
module.exports = router

const {
    addProduct,
    viewProduct,
    getProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/product')

router.post('/product-add', isAuth, isAdmin, addProduct)
router.get('/product-view', isAuth, viewProduct)
router.get('/product-get-page', isAuth, getProduct)
router.patch('/product-update', isAuth, isAdmin, updateProduct)
router.delete('/product-delete', isAuth, isAdmin, deleteProduct)
