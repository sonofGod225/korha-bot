"use strict";

module.exports = function (sequelize, DataTypes) {
    var courses = sequelize.define("courses", {
        name: DataTypes.STRING,
        slug: DataTypes.STRING,
        order: DataTypes.INTEGER,
    });
    return courses;
};