const helper = require('../helper/helper')
const {
    producthSchema,
    selectProducthSchema,
    getProducts,
} = require('../helper/validation')
const { logs } = require('../helper/loggerMessage')
const { CustomError } = require('../middleware/errorHandler')
const { Op } = require('sequelize')
const moment = require('moment')
const db = require('../models')
const fs = require('fs')
const fsPromises = require('fs').promises
const modelProduct = db.product

module.exports = {
    selectProduct: async (req, res, next) => {
        try {
            const { product_id } = req.body
            await selectProducthSchema.validateAsync(req.body)
            let result = await modelProduct.findByPk(product_id, {
                attributes: {
                    exclude: ['createdAt', 'deletedAt', 'updatedAt'],
                },
            })
            return helper.response(res, 200, 'success select product', result)
        } catch (e) {
            console.log(e)
            let message = 'Bad Request'
            let status = 400
            if (e.isJoi === true) {
                message = e.details[0].message
                status = 422
            }
            logs(`failed select product`, req.url, req.body, res.statusCode, {})
            helper.response(res, status, message, {})
            return next(new CustomError(message, 500))
        }
    },
    getProduct: async (req, res, next) => {
        try {
            const { product_name, category_id, sortCost } = req.body
            let { offset, limit } = req.body
            await getProducts.validateAsync(req.body)
            product_name != '' ? (offset = 0) : offset
            category_id ? (offset = 0) : page
            let result = await modelProduct.findAndCountAll({
                where: {
                    [Op.and]: [
                        {
                            product_name: {
                                [Op.iLike]: `%${product_name}%`,
                            },
                        },
                        {
                            category_id: category_id,
                        },
                    ],
                },
                // order: [
                //     ['id', 'DESC']
                // ],
                offset: offset,
                limit: limit,
            })

            let totalPage = 0
            if (product_name != '') {
                totalPage = Math.ceil(result.rows.length / limit)
            } else {
                totalPage = Math.ceil(result.count / limit)
            }

            const pagination = {
                totalData: result.count,
                totalPage: totalPage,
            }

            return helper.response(
                res,
                200,
                'success get all product',
                result,
                pagination
            )
        } catch (e) {
            console.log(e)
            let message = 'Bad Request'
            let status = 400
            if (e.isJoi === true) {
                message = e.details[0].message
                status = 422
            }
            helper.response(res, status, message, {})
            return next(new CustomError(message, status))
        }
    },
    addProduct: async (req, res, next) => {
        try {
            const raw = req.body
            const CurrentDate = moment().format('DD-MM-YY-hh;mm;ss')
            const fileName = `img-${CurrentDate}.txt`
            const directory = {
                local: `./src/uploads/products/${fileName}`,
                server: '',
            }

            await producthSchema.validateAsync(req.body)

            const data = {
                category_id: raw.category_id,
                product_name: raw.product_name,
                image: fileName,
                description: raw.description,
                price: raw.price,
                discount: raw.discount,
                active_status: raw.active_status,
            }

            let check = await modelProduct.findOne({
                where: {
                    product_name: {
                        [Op.like]: `%${raw.product_name.toLowerCase()}%`,
                    },
                },
            })

            if (!check) {
                await fsPromises.writeFile(
                    directory.local,
                    raw.image,
                    async (err) => {
                        console.log(err)
                    }
                )
                let product = await modelProduct.create(data)
                return helper.response(res, 200, 'success add product', product)
            } else {
                return helper.response(res, 400, 'product alredy exists', {})
            }
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
    updateProduct: async () => {},
    deleteProduct: async () => {},
    detailProduct: async () => {},
}
