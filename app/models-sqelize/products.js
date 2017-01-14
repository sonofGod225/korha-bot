"use strict";

module.exports = function (sequelize, DataTypes) {
    var products = sequelize.define("products", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        modele_id:DataTypes.INTEGER,
        price:DataTypes.STRING,
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        message: DataTypes.STRING,
        image: DataTypes.STRING
    },{
        classMethods: {
            associate: function (models) {
                commandes.hasMany(models.commandes, {as:'commandes',foreignKey: 'modele_id'})
            }
        }
    });

    return products;
};