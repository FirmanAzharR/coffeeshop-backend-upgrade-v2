const router = require('express').Router()
module.exports = router

const {
    loginUser,
    registerUser,
    forgotPassword,
    updatePassword,
    activationUser,
} = require('../controllers/auth')

router.post('/user-register', registerUser)
router.patch('/user-activation', activationUser)
router.post('/user-login', loginUser)
router.post('/forgot-password', forgotPassword)
router.patch('/update-password', updatePassword)
