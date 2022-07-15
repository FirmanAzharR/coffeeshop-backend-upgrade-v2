module.exports = {
    passportAuth: (passport) => {
        const JwtStrategy = require('passport-jwt').Strategy
        const ExtractJwt = require('passport-jwt').ExtractJwt
        const db = require('../models')
        let opts = {}
        opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
        opts.secretOrKey = 'intansyg'

        passport.use(
            new JwtStrategy(opts, async (jwt_payload, done) => {
                const user = await db.user.findOne({
                    where: { email: jwt_payload.email },
                })
                user ? done(null, user) : done(null, false)
            })
        )
    },
}
