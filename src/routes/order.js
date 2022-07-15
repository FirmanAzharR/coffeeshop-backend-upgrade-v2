const route = require('express').Router()
const { isAuth, isAdmin } = require('../middleware/authorization')

const {
    postOrder,
    getAllOrder,
    viewOrder,
    updateOrder,
} = require('../controllers/order')

route.post('/order-add', isAuth, postOrder)
route.get('/order-get-all', isAuth, getAllOrder)
route.get('/order-view', isAuth, viewOrder)
//route.delete('/order-delete', deleteOrder)
route.patch('/order-update', isAuth, isAdmin, updateOrder)

module.exports = route
