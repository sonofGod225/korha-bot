"use strict";

module.exports = function (sequelize, DataTypes) {
    var courses = sequelize.define("courses", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        slug: DataTypes.STRING,
        grade_id:DataTypes.INTEGER,
        order: DataTypes.INTEGER
    });
    return courses;
};