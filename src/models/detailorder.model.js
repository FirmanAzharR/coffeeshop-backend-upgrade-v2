module.exports = (sequelize, Sequelize) => {
    const DetailOrder = sequelize.define(
        'detail_order',
        {
            order_id: {
                type: Sequelize.INTEGER,
            },
            product_id: {
                type: Sequelize.INTEGER,
            },
            product_price: {
                type: Sequelize.INTEGER,
            },
        },
        {
            freezeTableName: true,
            paranoid: true,
        }
    )

    return DetailOrder
}
