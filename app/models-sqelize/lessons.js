"use strict";

module.exports = function (sequelize, DataTypes) {
    var lessons = sequelize.define("lessons", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        chapter_id: DataTypes.INTEGER,
        name: DataTypes.STRING,
        short: DataTypes.STRING,
        thumbnail: DataTypes.STRING,
        video: DataTypes.STRING,
        preview: DataTypes.STRING,
        body: DataTypes.TEXT,
        slug: DataTypes.STRING,
        order: DataTypes.INTEGER
    });
    return lessons;
};