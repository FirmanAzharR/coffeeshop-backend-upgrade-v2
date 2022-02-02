module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define(
        'user',
        {
            email: {
                type: Sequelize.STRING,
            },
            password: {
                type: Sequelize.STRING,
            },
            key: {
                type: Sequelize.STRING,
            },
        },
        {
            freezeTableName: true,
        }
    )

    return User
}
