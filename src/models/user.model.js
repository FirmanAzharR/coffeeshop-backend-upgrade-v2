module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define(
        'user',
        {
            number: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
            },
            password: {
                type: Sequelize.STRING,
            },
            key: {
                type: Sequelize.STRING,
            },
            active_status: {
                type: Sequelize.BOOLEAN,
            },
        },
        {
            freezeTableName: true,
        }
    )

    return User
}
