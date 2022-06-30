const helper = require('../helper/helper')
const { logs } = require('../helper/loggerMessage')
const { addProfile, idSchema } = require('../helper/validation')
const { CustomError } = require('../middleware/errorHandler')
const moment = require('moment')
const db = require('../models')
const fs = require('fs')
const profileModel = db.profile
const userModel = db.user

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
    viewProfile: async (req, res, next) => {
        try {
            const { id } = req.body
            await idSchema.validateAsync(req.body)

            const exclude = [
                'deletedAt',
                'createdAt',
                'updatedAt',
                'password',
                'key',
            ]
            userModel.hasOne(profileModel, {
                foreignKey: 'user_id',
            })

            let result = await userModel.findByPk(id, {
                attributes: {
                    exclude: exclude,
                },
                include: [
                    {
                        model: profileModel,
                        attributes: {
                            exclude: exclude,
                        },
                    },
                ],
            })

            let imageFile = ''

            if (result) {
                const imageName = `${directory.local}${result.dataValues.profile.dataValues.image}`
                if (fs.existsSync(imageName)) {
                    imageFile = fs.readFileSync(imageName, {
                        encoding: 'utf-8',
                    })
                } else {
                    imageFile = null
                }

                result.dataValues.profile.dataValues['imageFile'] = imageFile
            }

            return helper.response(res, 200, 'success view profile', result)
        } catch (e) {
            console.log(e)
            let message = `Bad Request : ${e}`
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
    updateProfile: async (req, res, next) => {},
}
