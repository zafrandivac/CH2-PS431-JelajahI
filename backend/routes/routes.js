const express = require("express");
const { getUsers, Register, Login } = require("../controller/Users");
const { verifyToken } = require("../middleware/verifyToken");

const router = express.Router();

router.get('/', async (req, res) => {
    res.status(200).json({
        message: "Welcome to JelajahI, Happy Traveling"
    })
});
router.get('/users', getUsers);
router.post('/users', Register);
router.post('/login', Login);

module.exports = { router };