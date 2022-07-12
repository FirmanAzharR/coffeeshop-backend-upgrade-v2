const helper = require('../helper/helper')
const config = require('../config/config')
const {
    cuponAdd,
    cuponUpdate,
    validateId,
    pageCupon,
} = require('../helper/validation')
const { logs } = require('../helper/loggerMessage')
const { CustomError } = require('../middleware/errorHandler')
const { Op } = require('sequelize')
const moment = require('moment')
const db = require('../models')
const fs = require('fs')
const modelCupon = db.cupon

//TODO:kurang cupon list untuk ditampilkan di homepage utama coffeeshop
module.exports = {
    addCupon: async (req, res, next) => {
        try {
            const raw = req.body
            await cuponAdd.validateAsync(raw)

            const CurrentDate = moment().format('DD-MM-YY-hh;mm;ss')
            const fileName = `img-${CurrentDate}.txt`

            const data = {
                name: raw.name,
                description: raw.description,
                discount: raw.discount,
                start_date: raw.start_date,
                end_date: raw.end_date,
                active_status: raw.active_status,
                image: fileName,
            }

            const result = await modelCupon.create(data)
            if (result) {
                fs.writeFileSync(
                    `${config.directory.local}cupons/${fileName}`,
                    raw.image
                )
                logs('success add cupon', req.url, {}, res.statusCode, {})
            }
            return helper.response(res, 200, 'success add cupon', result)
        } catch (e) {
            let message = `Bad Request, ${e}`
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
    updateCupon: async (req, res, next) => {
        try {
            const raw = req.body
            await cuponUpdate.validateAsync(raw)
            const check = await modelCupon.findByPk(raw.id)

            if (check) {
                const data = {
                    id: raw.id,
                    name: raw.name,
                    description: raw.description,
                    discount: raw.discount,
                    start_date: raw.start_date,
                    end_date: raw.end_date,
                    active_status: raw.active_status,
                    image: check.image,
                }

                const result = await modelCupon.update(data, {
                    where: { id: data.id },
                })
                if (result) {
                    fs.writeFileSync(
                        `${config.directory.local}cupons/${check.image}`,
                        raw.image
                    )
                    logs(
                        'success update cupon',
                        req.url,
                        {},
                        res.statusCode,
                        {}
                    )
                }
                return helper.response(res, 200, 'success update cupon', result)
            } else {
                return helper.response(res, 400, 'data cupon not found', {})
            }
        } catch (e) {
            let message = `Bad Request, ${e}`
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
    deleteCupon: async (req, res, next) => {
        try {
            const { id } = req.body
            await validateId.validateAsync(req.body)
            const check = await modelCupon.findByPk(id)

            if (check) {
                const result = await modelCupon.destroy({ where: { id: id } })
                if (result) {
                    fs.unlinkSync(`${directory.local}cupons/${check.image}`)
                }
                logs('success delete cupon', req.url, {}, res.statusCode, {})
                return helper.response(res, 200, 'success delete cupon', result)
            } else {
                logs('cupon not found', req.url, {}, res.statusCode, {})
                return helper.response(res, 400, 'data cupon not found', {})
            }
        } catch (e) {
            let message = `Bad Request, ${e}`
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
    viewCupon: async (req, res, next) => {
        try {
            const { id } = req.query
            const result = await modelCupon.findByPk(id)

            await validateId.validateAsync(req.query)

            if (result) {
                const fileImage = fs.readFileSync(
                    `${config.directory.local}cupons/${result.image}`,
                    { encoding: 'utf8', flag: 'r' }
                )
                result.dataValues.fileImage = fileImage
                logs('success view cupon', req.url, {}, res.statusCode, {})
                return helper.response(res, 200, 'success view cupon', result)
            } else {
                logs('cupon not found', req.url, {}, res.statusCode, {})
                return helper.response(res, 400, 'cupon not found', {})
            }
        } catch (e) {
            let message = `Bad Request, ${e}`
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
    getAllCupon: async (req, res, next) => {
        try {
            const { name, start_date } = req.query
            let { offset, limit } = req.query

            await pageCupon.validateAsync(req.query)

            let filter = []

            if (name) {
                filter.push({
                    name: {
                        [Op.iLike]: `%${name}%`,
                    },
                })

                offset = 0
            }

            if (start_date) {
                filter.push({ start_date: start_date })
                offset = 0
            }

            let result = await modelCupon.findAndCountAll({
                attributes: {
                    exclude: ['createdAt', 'deletedAt', 'updatedAt'],
                },
                where: {
                    [Op.and]: filter,
                },
                order: [['id', 'DESC']],
                offset: offset,
                limit: limit,
            })

            let totalPage = 0
            if (name && start_date) {
                totalPage = Math.ceil(result.rows.length / limit)
            } else {
                totalPage = Math.ceil(result.count / limit)
            }

            const pagination = {
                totalData: result.count,
                totalPage: totalPage,
            }

            logs('success get all cupon', req.url, {}, res.statusCode, {})
            return helper.response(
                res,
                200,
                'success get all cupon',
                result,
                pagination
            )
        } catch (e) {
            let message = `Bad Request, ${e}`
            let status = 400
            if (e.isJoi === true) {
                message = e.details[0].message
                status = 422
            }
            logs(message, req.url, {}, res.statusCode, {})
            helper.response(res, status, message, {})
            return next(new CustomError(message, status))
        }
    },
}
