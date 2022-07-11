const helper = require('../helper/helper')
const {
    orders,
    idSchema,
    getAllOrders,
    updateOrder,
} = require('../helper/validation')
const { logs } = require('../helper/loggerMessage')
const { CustomError } = require('../middleware/errorHandler')
const { Op } = require('sequelize')
const moment = require('moment')
const db = require('../models')
const orderModel = db.order
const detailOrderModel = db.detailorder
const profileModel = db.profile

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
                logs('success add order', req.url, {}, res.statusCode, {})
            }

            return helper.response(res, 200, 'success add order', saveOrder)
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
                logs('success get order', req.url, {}, res.statusCode, {})
                return helper.response(res, 200, 'success get order', result)
            } else {
                logs('order not found', req.url, {}, res.statusCode, {})
                return helper.response(res, 400, 'order not found', {})
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
    getAllOrder: async (req, res, next) => {
        try {
            const { invoice, customer_name, customer_phone, user_id } =
                req.query
            let { offset, limit } = req.query

            await getAllOrders.validateAsync(req.query)

            //filter
            let filterOrder = []
            let filterProfile = []

            if (invoice) {
                filterOrder.push({
                    invoice: {
                        [Op.iLike]: `%${invoice}%`,
                    },
                })
                offset = 0
            }

            if (user_id) {
                filterOrder.push({
                    user_id: user_id,
                })
                offset = 0
            }

            if (customer_name) {
                filterProfile.push({
                    fullname: {
                        [Op.iLike]: `%${customer_name}%`,
                    },
                })
                offset = 0
            }

            if (customer_phone) {
                filterProfile.push({
                    phone_nmuber: {
                        [Op.iLike]: `%${customer_phone}%`,
                    },
                })
                offset = 0
            }

            //end filter

            const exclude = ['deletedAt', 'createdAt', 'updatedAt', 'password']

            orderModel.belongsTo(profileModel, {
                targetKey: 'user_id',
                foreignKey: 'user_id',
            })

            let result = await orderModel.findAndCountAll({
                where: {
                    [Op.and]: filterOrder,
                },
                attributes: {
                    exclude: exclude,
                },
                include: [
                    {
                        model: profileModel,
                        where: {
                            [Op.and]: filterProfile,
                        },
                        attributes: {
                            exclude: exclude,
                        },
                    },
                ],
                order: [['id', 'DESC']],
                offset: offset,
                limit: limit,
            })

            let totalPage = 0
            if (customer_name && customer_phone && invoice) {
                totalPage = Math.ceil(result.rows.length / limit)
            } else {
                totalPage = Math.ceil(result.count / limit)
            }

            const pagination = {
                totalData: result.count,
                totalPage: totalPage,
            }

            logs('success get all order', req.url, {}, res.statusCode, {})

            return helper.response(
                res,
                200,
                'success get all order',
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
            return next(new CustomError(message, 500))
        }
    },
    updateOrder: async (req, res, next) => {
        try {
            const { id, order_status } = req.body

            await updateOrder.validateAsync(req.body)

            const check = await orderModel.findByPk(id)
            if (check) {
                const result = await orderModel.update(
                    { order_status: order_status },
                    { where: { id: check.id } }
                )
                logs('update order success', req.url, {}, res.statusCode, {})
                return helper.response(res, 200, 'update order success', result)
            } else {
                logs('order not found', req.url, {}, res.statusCode, {})
                return helper.response(res, 400, 'order not found', {})
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
}
