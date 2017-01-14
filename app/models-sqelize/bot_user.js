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
    },{
        classMethods: {
            associate: function (models) {
                commandes.hasMany(models.commandes, {as:'commandes',foreignKey: 'bot_user_id'})
            }
        }
    });
    return bot_users;
}
