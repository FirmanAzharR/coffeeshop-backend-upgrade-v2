module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define(
        'product',
        {
            category_id: {
                type: Sequelize.INTEGER,
            },
            product_name: {
                type: Sequelize.STRING,
            },
            image: {
                type: Sequelize.STRING,
            },
            description: {
                type: Sequelize.STRING,
            },
            active_status: {
                type: Sequelize.BOOLEAN,
            },
        },
        {
            freezeTableName: true,
            paranoid: true,
        }
    )

    return Product
}
