module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define(
        'order',
        {
            user_id: {
                type: Sequelize.INTEGER,
            },
            invoice: {
                type: Sequelize.STRING,
            },
            cupon_id: {
                type: Sequelize.INTEGER,
            },
            order_date: {
                type: Sequelize.DATE,
            },
            delivery_date: {
                type: Sequelize.DATE,
            },
            order_status: {
                type: Sequelize.INTEGER,
            },
            subtotal: {
                type: Sequelize.INTEGER,
            },
            total: {
                type: Sequelize.INTEGER,
            },
        },
        {
            freezeTableName: true,
            paranoid: true,
        }
    )

    return Order
}
