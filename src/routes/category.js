const router = require('express').Router()
module.exports = router

const { getListCategory } = require('../controllers/category')

router.get('/category-list', getListCategory)
