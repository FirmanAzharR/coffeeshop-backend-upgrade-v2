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
router.get('/user-login', loginUser)
router.get('/forgot-password', forgotPassword)
router.get('/update-password', updatePassword)
