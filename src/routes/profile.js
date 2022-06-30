const router = require('express').Router()
module.exports = router

const {
    updateProfile,
    viewProfile,
    updateAccount,
} = require('../controllers/profile')

router.patch('/profile-update', updateProfile)
router.get('/profile-view', viewProfile)
router.patch('/profile-update', updateAccount)
