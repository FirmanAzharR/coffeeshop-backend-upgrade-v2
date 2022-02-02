const Joi = require('joi')

const testSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    published: Joi.boolean().required(),
})

module.exports = {
    testSchema,
}
