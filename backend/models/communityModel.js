const { Sequelize } = require('sequelize');
const { db } = require("../config/database");

const { DataTypes } = Sequelize;

const Community = db.define('communities', {
    description: {
        type: DataTypes.TEXT('long')
    },
    placeName: {
        type: DataTypes.STRING
    },
    location: {
        type: DataTypes.FLOAT
    }
}, {
    timestamps: true
});

module.exports = { Community };