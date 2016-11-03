"use strict";

module.exports = function (sequelize, DataTypes) {
    var bot_type_message = sequelize.define("bot_type_message", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        bot_type_message_name: DataTypes.STRING,
        bot_type_message_show_name: DataTypes.STRING
    });
    return bot_type_message;
};