module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define(
        'category',
        {
            categroy_name: {
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

    return Category
}
