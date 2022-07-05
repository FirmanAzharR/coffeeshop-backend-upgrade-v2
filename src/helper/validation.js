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

const updateAccount = Joi.object({
    id: Joi.number().required(),
    email: Joi.string().required(),
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
})

const cuponAdd = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    discount: Joi.number().required(),
    start_date: Joi.string().required(),
    end_date: Joi.string().required(),
    active_status: Joi.number().required(),
    image: Joi.string().allow(null),
})

const cuponUpdate = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    discount: Joi.number().required(),
    start_date: Joi.string().required(),
    end_date: Joi.string().required(),
    active_status: Joi.number().required(),
    image: Joi.string().allow(null).required(),
})

const validateId = Joi.object({
    id: Joi.number().required(),
})

const pageCupon = Joi.object({
    name: Joi.string().allow(''),
    start_date: Joi.date().allow(null),
    limit: Joi.number().required(),
    offset: Joi.number().required(),
})

module.exports = {
    validateId,
    testSchema,
    authSchema,
    producthSchema,
    selectProducthSchema,
    getProducts,
    updateProfiles,
    idSchema,
    updateAccount,
    cuponAdd,
    cuponUpdate,
    pageCupon,
}
