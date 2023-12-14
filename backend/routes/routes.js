const express = require("express");
const multer = require("multer");
const { getUsers, Register, Login, editUser, deleteUser } = require("../controller/Users");
const { addPost, getAllPost } = require("../controller/Community");
const { verifyToken } = require("../middleware/verifyToken");

const router = express.Router();
const middle = express.urlencoded({ extended: false });
const upload = multer();

router.get('/', async (req, res) => {
    res.status(200).json({
        message: "Welcome to JelajahI, Happy Traveling"
    })
});
router.get('/users', getUsers);
router.post('/register', Register);
router.post('/login', upload.none(), Login);
router.post('/edit', upload.none(), editUser);
router.delete('/delete', deleteUser);
router.post('/newpost', upload.none(), addPost);
router.get('/allpost', getAllPost);

module.exports = { router };