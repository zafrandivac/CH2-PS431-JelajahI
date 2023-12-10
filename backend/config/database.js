const { Sequelize } = require("sequelize");

const db = new Sequelize('testung001', 'root', '1234', {
    host: "34.101.178.175",
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
