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

const directory = {
    local: `./src/uploads/products/`,
    server: '',
}

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
                req.body
            let { offset, limit } = req.body
            await getProducts.validateAsync(req.body)
            product_name != '' ? (offset = 0) : offset
            category_id ? (offset = 0) : page
            let result = await modelProduct.findAndCountAll({
                attributes: {
                    exclude: ['createdAt', 'deletedAt', 'updatedAt'],
                },
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
                    `${directory.local}${fileName}`,
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
                        `${directory.local}${check.image}`,
                        raw.image,
                        async (err) => {
                            return next(new CustomError(err, 500))
                        }
                    )
                }

                let result = await modelProduct.update(dataUpdate, {
                    where: { id: raw.product_id },
                })
                return helper.response(
                    res,
                    200,
                    'update product success',
                    result
                )
            } else {
                return helper.response(res, 400, 'product not found', {})
            }
        } catch (e) {
            console.log(e)
            let message = 'Bad Request'
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
            const { product_id } = req.body
            let result = {}
            await selectProducthSchema.validateAsync(req.body)
            let product = await modelProduct.findByPk(product_id, {
                attributes: {
                    exclude: ['createdAt', 'deletedAt', 'updatedAt'],
                },
            })

            if (product) {
                const fileImage = fs.readFileSync(
                    `${directory.local}${product.image}`,
                    { encoding: 'utf8', flag: 'r' }
                )

                result = product.dataValues
                result['dataImage'] = fileImage
                return helper.response(
                    res,
                    200,
                    'success select product',
                    result
                )
            } else {
                return helper.response(res, 400, 'product not found', {})
            }
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
                const path = `${directory.local}${check.image}`

                if (fs.existsSync(path)) {
                    fs.unlinkSync(path)
                }

                await modelProduct.destroy({
                    where: { id: product_id },
                })
            } else {
                return helper.response(res, 400, 'product not found', {})
            }

            return helper.response(res, 200, 'delete product success', {})
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
}
