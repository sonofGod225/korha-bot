"use strict";

module.exports = function (sequelize, DataTypes) {
    var bot_messages = sequelize.define("bot_messages", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        bot_type_message_name: DataTypes.STRING,
        bot_type_message_show_name: DataTypes.STRING
    });
    return bot_messages;
};