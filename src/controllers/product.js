const helper = require('../helper/helper')
const { producthSchema } = require('../helper/validation')
const { logs } = require('../helper/loggerMessage')
const { CustomError } = require('../middleware/errorHandler')
const { Op } = require('sequelize')
const moment = require('moment')
const db = require('../models')
const fs = require('fs');
const fsPromises = require('fs').promises
const modelProduct = db.product

module.exports = {
    getProduct: async () => { },
    selectProduct: async () => {},
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
                active_status: raw.active_status,
            }

            let check = await modelProduct.findOne({
                where: {
                    product_name: { [Op.like] : `%${raw.product_name.toLowerCase()}%`},
                },
            })

            if (!check) {
                await fsPromises.writeFile(directory.local, raw.image, async (err) => {
                    console.log(err)
                })                
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
            logs(`failed add product`, req.url, {}, res.statusCode, {})
            helper.response(res, status, 'failed add product', {})
            return next(new CustomError(message, 500))
        }
    },
    updateProduct: async () => {},
    deleteProduct: async () => {},
    detailProduct: async () => {},
}
