module.exports = (sequelize, Sequelize) => {
    const Profile = sequelize.define(
        'profile',
        {
            user_id: {
                type: Sequelize.INTEGER,
            },
            fullname: {
                type: Sequelize.STRING,
            },
            phone_number: {
                type: Sequelize.STRING,
            },
            address: {
                type: Sequelize.STRING,
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

    return Profile
}
