require('dotenv').config();

const express = require("express");
const { startdb } = require("./config/database");
const { router } = require("./routes/routes");

const app = express();

app.use(express.json());
app.use(router);

startdb();

app.listen(5000, () => console.log("Server Berjalan di Port 5000"));

module.exports = { app };