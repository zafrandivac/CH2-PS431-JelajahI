const express = require("express");
const multer = require("multer");
const { getUsers, Register, Login, editUser, deleteUser } = require("../controller/Users");
const { addPost, getAllPost, deletePost, editPost } = require("../controller/Community");
const { verifyToken } = require("../middleware/verifyToken");

const router = express.Router();
const middle = express.urlencoded({ extended: false });
const upload = multer();

router.get('/', async (req, res) => {
    res.status(200).json({
        message: "Welcome to JelajahI, Happy Traveling"
    })
});

// Route untuk user
router.get('/users', getUsers);
router.post('/register', Register);
router.post('/login', upload.none(), Login);
router.post('/edit', upload.none(), editUser);
router.delete('/delete', deleteUser);

// Route untuk community
router.post('/newpost', upload.none(), addPost);
router.get('/allpost', getAllPost);
router.post('/editpost', upload.none(), editPost);
router.delete('/deletepost', deletePost);

module.exports = { router };