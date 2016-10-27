"use strict";

module.exports = function (sequelize, DataTypes) {
    var grades = sequelize.define("grades", {
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