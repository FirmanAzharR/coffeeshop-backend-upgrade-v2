const helper = require('../helper/helper')
const { logs } = require('../helper/loggerMessage')
const { testSchema } = require('../helper/validation')
const db = require('../models')
const test = db.test
const Op = db.Sequelize.Op

module.exports = {
    testApi: async (req, res) => {
        try {
            await testSchema.validateAsync(req.body)
            const data = await test.create(req.body)
            logs(req.url, req.body, res.statusCode, data)
            return helper.response(res, 200, 'done', data)
        } catch (error) {
            let message = 'Bad Request'
            let status = 400
            if (error.isJoi === true) {
                message = error.details[0].message
                status = 422
            }
            return helper.response(res, status, message, null)
        }
    },
    getTest: async (req, res) => {
        const query = req.query
        let page = query.page ? query.page : 1
        let limit = query.limit ? query.limit : 10
        let search = query.search ? query.search : ''
        search ? (page = 1) : page
        try {
            const data = await test.findAndCountAll({
                where: {
                    description: {
                        [Op.iLike]: `%${search}%`,
                    },
                },
                limit: limit,
                offset: page * limit - limit,
            })
            let result = {
                data: data.rows,
                pageInfo: {
                    page: page,
                    limit: limit,
                    totalPage: Math.ceil(data.count / limit),
                    totalData: data.count,
                },
            }
            return helper.response(res, 200, 'done', result)
        } catch (e) {
            return helper.response(res, e, message, null)
        }
    },
}
