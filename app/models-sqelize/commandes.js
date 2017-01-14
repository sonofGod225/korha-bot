"use strict";

module.exports = function (sequelize, DataTypes) {
    var commandes = sequelize.define("commandes", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        bot_user_id:DataTypes.INTEGER,
        product_id:DataTypes.INTEGER,
        message:DataTypes.STRING,
        name: DataTypes.STRING
    });

    return commandes;
};