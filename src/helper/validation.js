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
    name: Joi.string(),
    start_date: Joi.string(),
    limit: Joi.number().required(),
    offset: Joi.number().required(),
})

const activationUser = Joi.object({
    id: Joi.number().required(),
    key: Joi.string().required(),
})

const loginValidation = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
})

const orders = Joi.object({
    user_id: Joi.number().required(),
    invoice: Joi.string().required(),
    cupon_id: Joi.number(),
    delivery_date: Joi.string().required(),
    order_date: Joi.string().required(),
    order_status: Joi.number().required(),
    subtotal: Joi.number().required(),
    total: Joi.number().required(),
    order_detail: Joi.any().required(),
})

const getAllOrders = Joi.object({
    invoice: Joi.string(),
    customer_name: Joi.string(),
    customer_phone: Joi.string(),
    user_id: Joi.number(),
    limit: Joi.number().required(),
    offset: Joi.number().required(),
})

const updateOrder = Joi.object({
    id: Joi.number().required(),
    order_status: Joi.number().required(),
})

module.exports = {
    updateOrder,
    getAllOrders,
    loginValidation,
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
    orders,
    activationUser,
}
