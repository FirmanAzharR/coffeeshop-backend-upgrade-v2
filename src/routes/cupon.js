const route = require('express').Router()

const {
    addCupon,
    updateCupon,
    deleteCupon,
    viewCupon,
    getAllCupon,
} = require('../controllers/cupon')

route.post('/cupon-add', addCupon)
route.get('/cupon-get-all', getAllCupon)
route.get('/cupon-view', viewCupon)
route.delete('/cupon-delete', deleteCupon)
route.patch('/cupon-update', updateCupon)

module.exports = route
