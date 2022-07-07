const helper = require('../helper/helper')
const { orders, idSchema } = require('../helper/validation')
const { logs } = require('../helper/loggerMessage')
const { CustomError } = require('../middleware/errorHandler')
const { Op } = require('sequelize')
const moment = require('moment')
const db = require('../models')
const orderModel = db.order
const detailOrderModel = db.detailorder

const addId = (x, id) => {
    return new Promise((resolve, reject) => {
        let i = 0
        x.forEach((v) => {
            v['order_id'] = id
            i++
        })
        i == x.length ? resolve(x) : reject(null)
    })
}

module.exports = {
    postOrder: async (req, res, next) => {
        try {
            const raw = req.body

            const now = moment().format('YYMD-h-m-ss-SS')
            const order_date = moment().format('YYYY-MM-DD HH:mm ZZ')

            raw.invoice = `INV-${now}`
            raw.order_date = order_date
            raw.order_status = 0

            await orders.validateAsync(raw)

            let detailOrder = Object.assign([], raw.order_detail)
            delete raw.order_detail

            let saveOrder = await orderModel.create(raw)
            if (saveOrder && detailOrder.length > 0) {
                let x = await addId(detailOrder, saveOrder.id)
                await detailOrderModel.bulkCreate(x)
            }

            return helper.response(res, 200, 'success add order', saveOrder)
        } catch (e) {
            console.log(e)
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
    viewOrder: async (req, res, next) => {
        try {
            const { id } = req.query
            await idSchema.validateAsync(req.query)

            const exclude = ['deletedAt', 'createdAt', 'updatedAt', 'password']

            orderModel.hasMany(detailOrderModel, {
                foreignKey: 'order_id',
            })

            let result = await orderModel.findByPk(id, {
                attributes: {
                    exclude: exclude,
                },
                include: [
                    {
                        model: detailOrderModel,
                        attributes: {
                            exclude: exclude,
                        },
                    },
                ],
            })

            if (result) {
                return helper.response(res, 200, 'success get order', result)
            } else {
                return helper.response(res, 400, 'order not found', {})
            }
        } catch (e) {
            console.log(e)
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
    getAllOrder: async (req, res, next) => {
        try {
        } catch (e) {}
    },
    updateOrder: async (req, res, next) => {
        try {
        } catch (e) {}
    },
    deleteOrder: async (req, res, next) => {
        try {
        } catch (e) {}
    },
}
