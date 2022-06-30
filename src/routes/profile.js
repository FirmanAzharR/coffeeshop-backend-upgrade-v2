const router = require('express').Router()
module.exports = router

const { addProfile, viewProfile } = require('../controllers/profile')

router.post('/profile-add', addProfile)
router.get('/profile-view', viewProfile)
