const router = require('express').Router()
module.exports = router

const { addProfile } = require('../controllers/profile')

router.post('/profile-add', addProfile)
