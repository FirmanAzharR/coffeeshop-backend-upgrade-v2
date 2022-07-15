const router = require('express').Router()
const { passportAuthz } = require('../middleware/authorization')
const { getListCategory } = require('../controllers/category')

router.get('/category-list', passportAuthz, getListCategory)
module.exports = router
