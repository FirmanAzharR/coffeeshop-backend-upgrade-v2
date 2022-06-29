const helper = require('../helper/helper')
const { logs } = require('../helper/loggerMessage')
const { addProfile } = require('../helper/validation')
const { CustomError } = require('../middleware/errorHandler')
const moment = require('moment')
const db = require('../models')
const fs = require('fs')
const profileModel = db.profile

const directory = {
    local: `./src/uploads/profiles/`,
    server: '',
}

module.exports = {
    addProfile: async (req, res, next) => {
        try {
            const raw = req.body

            await addProfile.validateAsync(req.body)

            const CurrentDate = moment().format('DD-MM-YY-hh;mm;ss')
            const fileName = `img-${CurrentDate}.txt`

            const data = {
                user_id: raw.user_id,
                fullname: raw.fullname,
                phone_number: raw.phone_number,
                address: raw.address,
                image: fileName,
            }

            let result = await profileModel.create(data)
            let msg = 'success add profile'
            if (result) {
                if (raw.image) {
                    fs.writeFileSync(`${directory.local}${fileName}`, raw.image)
                }
            }

            logs(msg, req.url, data, res.statusCode, {})
            return helper.response(res, 200, msg, result)
        } catch (e) {
            console.log(e)
            let message = 'Bad Request'
            let status = 400
            if (e.isJoi === true) {
                message = e.details[0].message
                status = 422
            }
            logs(message, req.url, {}, res.statusCode, {})
            helper.response(res, status, message, {})
            return next(new CustomError(message, 500))
        }
    },
}
