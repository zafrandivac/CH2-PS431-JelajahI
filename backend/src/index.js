require('dotenv').config();

const express = require("express");
const cors = require('cors');
const { startdb } = require("./config/database");
const { router } = require("./routes/routes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);

startdb();

app.listen(process.env.WEBAPP_SERVER_PORT, () => console.log(`Server Berjalan di Port ${process.env.WEBAPP_SERVER_PORT}`));

module.exports = { app };
