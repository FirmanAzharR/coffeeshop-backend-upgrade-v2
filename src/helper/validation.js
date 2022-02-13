const Joi = require('joi')

const testSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    published: Joi.boolean().required(),
})

const authSchema = Joi.object({
    number: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
})

module.exports = {
    testSchema,
    authSchema,
}
