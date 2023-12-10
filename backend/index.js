require('dotenv').config();

const express = require("express");
const { startdb } = require("./config/database");
const { router } = require("./routes/routes");

const app = express();

app.use(express.json());
app.use(router);

startdb();

app.listen(process.env.WEBAPP_SERVER_PORT || 8080, () => console.log(`Server Berjalan di Port ${process.env.WEBAPP_SERVER_PORT}`));

module.exports = { app };