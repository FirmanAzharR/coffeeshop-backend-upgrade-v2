const route = require('express').Router()

const {
    postOrder,
    getAllOrder,
    viewOrder,
    deleteOrder,
    updateOrder,
} = require('../controllers/order')

route.post('/order-add', postOrder)
route.post('/order-get-all', getAllOrder)
route.get('/order-view', viewOrder)
route.delete('/order-delete', deleteOrder)
route.patch('/order-update', updateOrder)

module.exports = route
