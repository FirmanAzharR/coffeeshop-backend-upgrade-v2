const helper = require('../helper/helper')
const { logs } = require('../helper/loggerMessage')
const { CustomError } = require('../middleware/errorHandler')
const db = require('../models')
const categoryModel = db.category

module.exports = {
    getListCategory: async (req, res, next) => {
        try {
            const msg = 'success get list category'
            const result = await categoryModel.findAll({
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'deletedAt'],
                },
            })
            logs(msg, req.url, req.body, res.statusCode, {})
            return helper.response(res, 200, msg, result)
        } catch (e) {
            logs(e, req.url, req.body, res.statusCode, {})
            helper.response(res, 400, e, {})
            return next(new CustomError(message, 500))
        }
    },
}
