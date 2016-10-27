module.exports = function (sequelize, DataTypes) {
    const users = sequelize.define('users', {
        id:DataTypes.INTEGER,
        email: DataTypes.STRING,
        facebook_id: DataTypes.STRING,
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        avatar: DataTypes.STRING,
        gender: DataTypes.STRING,
    });
    return users;
}
