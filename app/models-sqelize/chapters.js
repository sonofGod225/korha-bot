"use strict";

module.exports = function (sequelize, DataTypes) {
    var chapters = sequelize.define("chapters", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        slug: DataTypes.STRING,
        course_id: DataTypes.INTEGER,
        order: DataTypes.INTEGER
    });
    return chapters;
};