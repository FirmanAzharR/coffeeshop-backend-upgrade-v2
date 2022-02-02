const router = require('express').Router()
module.exports = router

const { testApi, getTest } = require('../controllers/test')

router.post('/api-test', testApi)
router.get('/get-test', getTest)
