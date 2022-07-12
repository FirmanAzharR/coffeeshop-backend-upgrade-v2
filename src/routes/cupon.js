const route = require('express').Router()
const { isAuth, isAdmin } = require('../middleware/authorization')

const {
    addCupon,
    updateCupon,
    deleteCupon,
    viewCupon,
    getAllCupon,
} = require('../controllers/cupon')

route.post('/cupon-add', isAuth, isAdmin, addCupon)
route.get('/cupon-get-all', isAuth, isAdmin, getAllCupon)
route.get('/cupon-view', isAuth, viewCupon)
route.delete('/cupon-delete', isAuth, isAdmin, deleteCupon)
route.patch('/cupon-update', isAuth, isAdmin, updateCupon)

module.exports = route
