const { isAuth } = require('../middleware/authorization')
const router = require('express').Router()
module.exports = router

const {
    updateProfile,
    viewProfile,
    updateAccount,
} = require('../controllers/profile')

router.patch('/profile-update', isAuth, updateProfile)
router.get('/profile-view', isAuth, viewProfile)
router.patch('/profile-update-account', isAuth, updateAccount)
