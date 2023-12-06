import { where } from "sequelize";
import Users from "../models/userModel.js";
import bcrypt from "bcrypt";

export const getUsers = async(req, res) => {
    try {
        const users = await Users.findAll();
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

export const Register = async(req, res) => {
    const {name, email, password, confPass} = req.body;
    const salt = await bcrypt.genSalt();
    const hashPass = await bcrypt.hash(password, salt);
    const emailExists = await Users.findOne({ where: { email: req.body.email } });
    console.log("testung");
    console.log("testung2");
    if (password !== confPass) return res.status(400).json({msg: "Password dan Confirm Password tidak sesuai"});
    if (!password) return res.status(400).json({msg: "Password tidak boleh kosong"});
    if (emailExists ) return res.status(400).json({msg: "Email Sudah Terdaftar"});

    try {
        await Users.create({
            name : name,
            email : email,
            password : hashPass
        })
        res.json({msg: "Register Berhasil dilakukan"})
    } catch (error) {
        console.log(error);
    }
}
