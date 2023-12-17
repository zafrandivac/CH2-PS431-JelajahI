require('dotenv').config();
const { Sequelize } = require("sequelize");

const db = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_ROOT_PASSWORD, {
    host: process.env.MYSQL_ROOT_HOST,
    dialect: "mysql"
});

const startdb = async () => {
    try {
        await db.authenticate();
        console.log('Database Connected');
    } catch (error) {
        console.log(error);
    }
}

module.exports = { db, startdb };
