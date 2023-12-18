const { Sequelize } = require('sequelize');
const { db } = require("../config/database");

const { DataTypes } = Sequelize;

const Batik = db.define('batiks', {
    name: {
        type: DataTypes.STRING
    },
    type: {
        type: DataTypes.STRING
    },
    origin: {
        type: DataTypes.STRING
    },
    latitude: {
        type: DataTypes.FLOAT
    },
    longitude: {
        type: DataTypes.FLOAT
    },
    province: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT('long')
    }
});

module.exports = { Batik };