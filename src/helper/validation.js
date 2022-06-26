const Joi = require('joi')

const testSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    published: Joi.boolean().required(),
})

const authSchema = Joi.object({
    number: Joi.string().required(),
    email: Joi.string().required(),
    role: Joi.number().required(),
    password: Joi.string().required(),
})

const producthSchema = Joi.object({
    category_id: Joi.number().required(),
    product_name: Joi.string().required(),
    image: Joi.any(),
    description: Joi.string().required(),
    active_status: Joi.number().required()
})

module.exports = {
    testSchema,
    authSchema,
    producthSchema
}
