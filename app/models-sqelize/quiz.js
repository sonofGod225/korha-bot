"use strict";

module.exports = function (sequelize, DataTypes) {
    var quiz = sequelize.define("quiz", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        timer: DataTypes.STRING,
        lesson_id: DataTypes.INTEGER
    });
    return quiz;
};