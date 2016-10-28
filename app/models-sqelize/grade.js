"use strict";

module.exports = function (sequelize, DataTypes) {
    var grades = sequelize.define("grades", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        commentaire_bot:DataTypes.STRING,
        name: DataTypes.STRING,
        slug: DataTypes.STRING,
        order: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function (models) {
                grades.hasMany(models.courses, {as:'courses',foreignKey: 'grade_id'})
            }
        }
    });

    return grades;
};