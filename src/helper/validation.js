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
    price: Joi.number().required(),
    discount: Joi.number().required(),
    active_status: Joi.number().required(),
})

const selectProducthSchema = Joi.object({
    product_id: Joi.number().required(),
})
const idSchema = Joi.object({
    id: Joi.number().required(),
})

const getProducts = Joi.object({
    product_name: Joi.string().allow(''),
    category_id: Joi.number().required(),
    offset: Joi.number().required(),
    limit: Joi.number().required(),
    sort: Joi.string(),
})

const updateProfiles = Joi.object({
    user_id: Joi.number().required(),
    fullname: Joi.string().required(),
    phone_number: Joi.string().required(),
    address: Joi.string().required(),
    image: Joi.string(),
})

module.exports = {
    testSchema,
    authSchema,
    producthSchema,
    selectProducthSchema,
    getProducts,
    updateProfiles,
    idSchema,
}
