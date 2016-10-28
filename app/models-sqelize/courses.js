"use strict";

module.exports = function (sequelize, DataTypes) {
    var courses = sequelize.define("courses", {
        name: DataTypes.STRING,
        slug: DataTypes.STRING,
        grade_id:DataTypes.INTEGER,
        order: DataTypes.INTEGER
    });
    return courses;
};