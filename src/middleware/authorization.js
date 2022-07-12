const helper = require('../helper/helper')
const jwt = require('jsonwebtoken')
const { logs } = require('../helper/loggerMessage')

module.exports = {
    isAuth: (req, res, next) => {
        let token = req.headers.authorization

        if (token) {
            token = token.split(' ')[1]
            jwt.verify(token, 'intansyg', (error, result) => {
                if (
                    (error && error.name === 'JsonWebTokenError') ||
                    (error && error.name === 'TokenExpiredError')
                ) {
                    logs(error.message, req.url, {}, 400, {})
                    return helper.response(res, 400, error.message)
                } else {
                    req.decodeToken = result
                    next()
                }
            })
        } else {
            helper.response(res, 401, 'please login first', {})
        }
    },
    isAdmin: (req, res, next) => {
        if (req.decodeToken.role !== 1) {
            return helper.response(res, 400, 'you are not admin!')
        } else {
            next()
        }
    },
}
