const route = require('express').Router()

const {
    postOrder,
    getAllOrder,
    viewOrder,
    updateOrder,
} = require('../controllers/order')

route.post('/order-add', postOrder)
route.get('/order-get-all', getAllOrder)
route.get('/order-view', viewOrder)
//route.delete('/order-delete', deleteOrder)
route.patch('/order-update', updateOrder)

module.exports = route
