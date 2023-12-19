const express = require("express");
const multer = require("multer");
const axios = require('axios');
const { getUsers, Register, Login, editUser, deleteUser, getData } = require("../controller/Users");
const { addPost, getAllPost, deletePost, editPost } = require("../controller/Community");
const { predictBatik } = require("../controller/Prediction");
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
router.post('/newpost', upload.single('reviewPicture'), addPost);
router.get('/allpost', getAllPost);
router.post('/editpost', upload.none(), editPost);
router.delete('/deletepost', deletePost);

// Route untuk places api
router.post('/getExplore', getData);

// Route untuk prediction model
router.post('/batik-predictions', (req, res) => {
    // Handle the incoming predictions from Flask
    const predictions = req.body.predictions;

    // Add your logic to process the predictions as needed

    res.json({ predictions });
});

module.exports = { router };
