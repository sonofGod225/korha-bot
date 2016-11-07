module.exports = function (sequelize, DataTypes) {
    const bot_users = sequelize.define('bot_users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        facebook_id: DataTypes.STRING,
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING
    });
    return bot_users;
}
