module.exports = function (sequelize, DataTypes) {
    const users = sequelize.define('users', {
        email: {type: String, default: ''},
        facebook_id: DataTypes.STRING,
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        avatar: DataTypes.STRING,
        gender: DataTypes.STRING,
    });
    return users;
}
