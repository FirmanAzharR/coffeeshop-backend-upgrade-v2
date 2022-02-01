const router = require('express').Router()
module.exports = router

const { testApi } = require('../controller/test')

router.get('/api-test', testApi)