const { Users } = require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { cast } = require("sequelize");

const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ['id', 'name', 'email']
        }); 87
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

const Register = async (req, res) => {
    const { name, email, password, confPass } = req.body;
    const salt = await bcrypt.genSalt();
    const hashPass = await bcrypt.hash(password, salt);
    const emailExists = await Users.findOne({ where: { email: req.body.email } });

    if (password !== confPass) {
        return res.status(400).json({ msg: "Password dan Confirm Password tidak sesuai" });
    } else {
        if (!password) {
            return res.status(400).json({ msg: "Password tidak boleh kosong" });
        } else {
            if (!email) {
                return res.status(400).json({ msg: "Email tidak boleh kosong" });
            } else {
                if (!name) {
                    return res.status(400).json({ msg: "Nama tidak boleh kosong" });
                } else {
                    if (emailExists) {
                        return res.status(400).json({ msg: "Email Sudah Terdaftar" });
                    }
                }
            }
        }
    }

    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPass
        })
        res.json({ msg: "Register Berhasil dilakukan" })
    } catch (error) {
        console.log(error);
    }
}

const Login = async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
  
      // Using Sequelize to check if email exists
      const user = await Users.findOne({ where: { email: email } });
  
      if (!user) {
        res.status(404).json({ msg: 'Email not found' });
      } else {
        const match = await bcrypt.compare(password, user.password);
  
        if (!match) {
          res.status(401).json({ error: true, msg: 'Invalid email or password' });
        } else {
          const userId = user.id;
          const name = user.name;
          const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' });
          const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
  
          await Users.update({ refresh_token: refreshToken }, {
            where: { id: userId }
          });
  
          res.json({
            error: false,
            msg: 'Login successful',
            loginResult: {
              userId,
              name,
              accessToken
            }
          });
        }
      }
    } catch (error) {
      console.error(error);  // Log the error for debugging
      res.status(500).json({ error: true, msg: 'Internal server error', details: error.message });
    }
  }

const editUser = async (req, res) => {
    const { id, name } = req.body;
    try {
        const user = await Users.update({ name: name }, {
            where: {
                id: id
            }
        });
        res.json({ msg: "Profile sudah di-update" })
    } catch (error) {
        console.log(error);
    }
}

const deleteUser = async (req, res) => {
    const { name } = req.body;
    try {
        const user = await Users.destroy({
            where: {
                name: name
            }
        });
        res.json({ msg: "User sudah berhasil dihapus" })
    } catch (error) {
        console.log(error);
    }
}

module.exports = { getUsers, Register, Login, editUser, deleteUser }
