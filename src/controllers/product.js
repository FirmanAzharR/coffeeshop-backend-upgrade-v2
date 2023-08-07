const helper = require('../helper/helper')
const {
    producthSchema,
    selectProducthSchema,
    getProducts,
} = require('../helper/validation')
const config = require('../config/config')
const { logs } = require('../helper/loggerMessage')
const { CustomError } = require('../middleware/errorHandler')
const { Op } = require('sequelize')
const moment = require('moment')
const db = require('../models')
const fs = require('fs')
const fsPromises = require('fs').promises
const modelProduct = db.product

// function existsAsync(path) {
//     return new Promise(function (resolve, reject) {
//         fs.exists(path, function (exists) {
//             resolve(exists)
//         })
//     })
// }

//TODO:MENAMBAHKAN LOG DISETIAP KONTROLLER
module.exports = {
    getProduct: async (req, res, next) => {
        try {
            const { product_name, category_id, sortCost, sortDiscount } =
                req.query
            let { offset, limit } = req.query

            let filter = []

            await getProducts.validateAsync(req.query)

            if (product_name) {
                filter.push({
                    product_name: {
                        [Op.iLike]: `%${product_name}%`,
                    },
                })
                offset = 0
            }

            if (category_id) {
                filter.push({
                    category_id: category_id,
                })
                offset = 0
            }

            let result = await modelProduct.findAndCountAll({
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
            if (product_name != '') {
                totalPage = Math.ceil(result.rows.length / limit)
            } else {
                totalPage = Math.ceil(result.count / limit)
            }

            const pagination = {
                totalData: result.count,
                totalPage: totalPage,
            }

            logs(
                `success get all product`,
                req.url,
                req.body,
                res.statusCode,
                {}
            )

            return helper.response(
                res,
                200,
                'success get all product',
                result,
                pagination
            )
        } catch (e) {
            let message = `Bad Request ${e}`
            let status = 400
            if (e.isJoi === true) {
                message = e.details[0].message
                status = 422
            }
            logs(`failed get product`, req.url, req.body, res.statusCode, {})
            helper.response(res, status, message, {})
            return next(new CustomError(message, status))
        }
    },
    addProduct: async (req, res, next) => {
        try {
            const raw = req.body
            const CurrentDate = moment().format('DD-MM-YY-hh;mm;ss')
            const fileName = `img-${CurrentDate}.txt`

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
                //bisa juga pakai fs.writeFileSync
                await fsPromises.writeFile(
                    `${config.directory.server}products/${fileName}`,
                    raw.image,
                    async (err) => {
                        console.log(err)
                    }
                )
                let product = await modelProduct.create(data)
                logs(
                    `success add product`,
                    req.url,
                    req.body,
                    res.statusCode,
                    {}
                )
                return helper.response(res, 200, 'success add product', product)
            } else {
                logs(
                    `product alredy exists`,
                    req.url,
                    req.body,
                    res.statusCode,
                    {}
                )
                return helper.response(res, 400, 'product alredy exists', {})
            }
        } catch (e) {
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
    updateProduct: async (req, res, next) => {
        //TODO:MENAMBAHKAN CHECK NAMA PRODUK UNTUK UPDATE
        try {
            const raw = req.body

            let check = await modelProduct.findOne({
                where: { id: raw.product_id },
            })

            if (check) {
                const dataUpdate = {
                    product_name: raw.product_name,
                    description: raw.description,
                    price: raw.price,
                    discount: raw.discount,
                    image: check.image,
                    active_status: raw.active_status,
                }

                if (raw.image) {
                    await fsPromises.writeFile(
                        `${config.directory.local}products/${check.image}`,
                        raw.image,
                        async (err) => {
                            return next(new CustomError(err, 500))
                        }
                    )
                }

                let result = await modelProduct.update(dataUpdate, {
                    where: { id: raw.product_id },
                })
                logs(`update product success`, req.url, {}, res.statusCode, {})
                return helper.response(
                    res,
                    200,
                    'update product success',
                    result
                )
            } else {
                logs(`product not found`, req.url, {}, res.statusCode, {})
                return helper.response(res, 400, 'product not found', {})
            }
        } catch (e) {
            let message = `Bad Request ${e}`
            let status = 400
            if (e.isJoi === true) {
                message = e.details[0].message
                status = 422
            }
            logs(`failed update product`, req.url, {}, res.statusCode, {})
            helper.response(res, status, message, {})
            return next(new CustomError(message, 500))
        }
    },
    viewProduct: async (req, res, next) => {
        try {
            const { product_id } = req.query
            let result = {}
            await selectProducthSchema.validateAsync(req.query)
            let product = await modelProduct.findByPk(product_id, {
                attributes: {
                    exclude: ['createdAt', 'deletedAt', 'updatedAt'],
                },
            })

            if (product) {
                const fileImage = fs.readFileSync(
                    `${config.directory.local}products/${product.image}`,
                    { encoding: 'utf8', flag: 'r' }
                )

                result = product.dataValues
                result['dataImage'] = fileImage

                logs(
                    `success select product`,
                    req.url,
                    req.body,
                    res.statusCode,
                    {}
                )

                return helper.response(
                    res,
                    200,
                    'success select product',
                    result
                )
            } else {
                logs(`product not found`, req.url, req.body, res.statusCode, {})
                return helper.response(res, 400, 'product not found', {})
            }
        } catch (e) {
            let message = `Bad Request ${e}`
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
    deleteProduct: async (req, res, next) => {
        try {
            const { product_id } = req.body
            await selectProducthSchema.validateAsync(req.body)

            let check = await modelProduct.findOne({
                where: { id: product_id },
            })

            if (check) {
                // fs.exists vs fs.existsSync = exists is asyncronous not wait exists to execute next line
                // and existSync is syncronous wait process existSync before executing next line
                const path = `${config.directory.local}products/${check.image}`

                if (fs.existsSync(path)) {
                    fs.unlinkSync(path)
                }

                await modelProduct.destroy({
                    where: { id: product_id },
                })
                logs(
                    `delete product success`,
                    req.url,
                    req.body,
                    res.statusCode,
                    {}
                )
                return helper.response(res, 200, 'delete product success', {})
            } else {
                logs(`product not found`, req.url, req.body, res.statusCode, {})
                return helper.response(res, 400, 'product not found', {})
            }
        } catch (e) {
            let message = `Bad Request ${e}`
            let status = 400
            if (e.isJoi === true) {
                message = e.details[0].message
                status = 422
            }
            helper.response(res, status, message, {})
            return next(new CustomError(message, status))
        }
    },
}
