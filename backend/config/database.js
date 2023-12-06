import { Sequelize} from "sequelize";

const db = new Sequelize('testung001', 'root', '1234',{
    host: "34.101.178.175",
    dialect: "mysql"
});

export default db;
