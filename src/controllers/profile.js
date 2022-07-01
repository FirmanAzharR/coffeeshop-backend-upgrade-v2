const helper = require('../helper/helper')
const { logs } = require('../helper/loggerMessage')
const {
    updateProfiles,
    idSchema,
    updateAccount,
} = require('../helper/validation')
const { CustomError } = require('../middleware/errorHandler')
const moment = require('moment')
const bcrypt = require('bcrypt')
const db = require('../models')
const fs = require('fs')
const profileModel = db.profile
const userModel = db.user

const directory = {
    local: `./src/uploads/profiles/`,
    server: '',
}

module.exports = {
    updateProfile: async (req, res, next) => {
        try {
            const raw = req.body
            let msg = ''
            let data = {}
            let results = {}
            let fileName = ''

            await updateProfiles.validateAsync(req.body)

            let check = await profileModel.findOne({
                where: { user_id: raw.user_id },
            })

            if (check) {
                const CurrentDate = moment().format('DD-MM-YY-hh;mm;ss')
                check.image
                    ? (fileName = check.image)
                    : (fileName = `img-${CurrentDate}.txt`)

                data = {
                    fullname: raw.fullname,
                    phone_number: raw.phone_number,
                    address: raw.address,
                    image: fileName,
                }

                let result = await profileModel.update(data, {
                    where: { id: check.id },
                })
                if (result) {
                    if (raw.image) {
                        fs.writeFileSync(
                            `${directory.local}${fileName}`,
                            raw.image
                        )
                    }
                }
                msg = 'success update profile'
                results = result
            }

            logs(msg, req.url, data, res.statusCode, {})
            return helper.response(res, 200, msg, results)
        } catch (e) {
            console.log(e)
            let message = `Bad Request ${e}`
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
    updateAccount: async (req, res, next) => {
        try {
            //TODO::BELUM KELAR SUOG
            const { id, username, oldPassword, newPassword } = req.body

            await updateAccount.validateAsync(req.body)

            let check = await userModel.findByPk(id, {
                attributes: ['id', 'password'],
            })

            if (check) {
                if (bcrypt.compareSync(oldPassword, check.password)) {
                    const salt = bcrypt.genSaltSync(10)
                    const hashPassword = bcrypt.hashSync(newPassword, salt)
                    const data = {
                        username: username,
                        password: hashPassword,
                    }
                    await userModel.update(data, { where: { id: id } })
                    return helper.response(res, 200, 'success update account')
                } else {
                    return helper.response(res, 400, 'old password not match')
                }
            }
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
}
