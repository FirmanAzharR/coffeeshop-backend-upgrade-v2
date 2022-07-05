module.exports = (sequelize, Sequelize) => {
    const Cupon = sequelize.define(
        'cupon',
        {
            name: {
                type: Sequelize.STRING,
            },
            description: {
                type: Sequelize.STRING,
            },
            discount: {
                type: Sequelize.INTEGER,
            },
            start_date: {
                type: Sequelize.DATE,
            },
            end_date: {
                type: Sequelize.DATE,
            },
            active_status: {
                type: Sequelize.BOOLEAN,
            },
            image: {
                type: Sequelize.STRING,
            },
        },
        {
            freezeTableName: true,
            paranoid: true,
        }
    )

    return Cupon
}
