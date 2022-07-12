const router = require('express').Router()
const { isAuth } = require('../middleware/authorization')
module.exports = router

const { getListCategory } = require('../controllers/category')

router.get('/category-list', isAuth, getListCategory)
