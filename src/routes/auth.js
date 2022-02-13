const router = require('express').Router()
module.exports = router

const {
    loginUser,
    registerUser,
    forgotPassword,
    updatePassword,
} = require('../controllers/auth')

router.post('/user-register', registerUser)
router.get('/user-login', loginUser)
router.get('/forgot-password', forgotPassword)
router.get('/update-password', updatePassword)
