"use strict";

module.exports = function (sequelize, DataTypes) {
    var modeles = sequelize.define("modeles", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        gender_id:DataTypes.INTEGER,
        message:DataTypes.STRING,
        name: DataTypes.STRING
    } ,{
        classMethods: {
            associate: function (models) {
                products.hasMany(models.products, {as:'products',foreignKey: 'modele_id'})
            }
        }
    });

    return modeles;
};