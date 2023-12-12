const express = require("express");
const { getUsers, Register, Login } = require("../controller/Users");
const { verifyToken } = require("../middleware/verifyToken");

const router = express.Router();
const middle = express.urlencoded({ extended: false });

router.get('/', async (req, res) => {
    res.status(200).json({
        message: "Welcome to JelajahI, Happy Traveling"
    })
});
router.get('/users', getUsers);
router.post('/register', Register);
router.post('/login', middle, Login);

module.exports = { router };