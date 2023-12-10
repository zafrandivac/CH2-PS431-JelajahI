import express from "express";
import { getUsers, Register, Login } from "../controller/Users.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get('/', async (req, res) => {
    res.status(200).json({
        message: "Welcome Jingkontod"
    })
});
router.get('/users', verifyToken, getUsers);
router.post('/users', Register);
router.post('/login', Login);

export default router;