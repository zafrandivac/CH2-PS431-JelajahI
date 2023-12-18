const { Users } = require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { cast } = require("sequelize");
const axios = require("axios");

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
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt();
    const hashPass = await bcrypt.hash(password, salt);
    const emailExists = await Users.findOne({ where: { email: req.body.email } });
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
        const user = await Users.findAll({
            where: {
                email: req.body.email
            }
        });
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if (!match) return res.status(400).json({
            error: true,
            msg: "Password tidak sesuai"
        });

        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' });
        const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
        await Users.update({ refresh_token: refreshToken }, {
            where: {
                id: userId
            }
        });
        if (match) return res.status(200).json(
            {
                error: false,
                msg: "Login Berhasil Dilakukan",
                loginResult: {
                    userId,
                    name,
                    accessToken
                }
            });
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).json({ error: true, msg: 'Internal server error', details: error.message });
    }
}

const editUser = async (req, res) => {
    try {
        const { email, currentPassword, newPassword, username } = req.body;
        const findUser = await Users.findOne({
            where: { email: email }
        });

        if (!findUser) {
            return res.status(404).json({ msg: "Email doesn't exist" });
        } else {
            // Compare current password
            const match = await bcrypt.compare(currentPassword, findUser.password);

            if (!match) {
                return res.status(400).json({ msg: "Password tidak sesuai" });
            }

            // Hash the new password
            const salt = await bcrypt.genSalt();
            const hashNewPass = await bcrypt.hash(newPassword, salt);

            // Update user with new password
            const updateUser = await Users.update(
                { name: username, password: hashNewPass },
                { where: { email: email } }
            );

            if (updateUser[0] === 1) {
                return res.json({ success: true, message: 'Updated successfully' });
            } else {
                return res.status(404).json({ success: false, message: 'Updated failed' });
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
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

const getData = async (req, res) => {
    try {
        const { propertyName } = req.body;
        let apiUrl;

        switch (propertyName) {
            case 'batiklasem':
                apiUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=kerajinan_batik_di_daerah_Rembang&location=-6.707107734936229%2C111.3318315373741&radius=20000&business_status=OPERATIONAL&key=AIzaSyDikJA_zqvlFv4heu7UnWMht7j1JOTpiN8';
                break;
            case 'batikparang':
            case 'batiksekarjagad':
            case 'batiksogan':
            case 'batiktruntum':
                apiUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=kerajinan_batik_di_daerah_Solo&location=-7.567375126550622%2C110.82859560170351&radius=20000&business_status=OPERATIONAL&key=AIzaSyDikJA_zqvlFv4heu7UnWMht7j1JOTpiN8';
                break;
            case 'batikpati':
                apiUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=kerajinan_batik_di_daerah_Pati&location=-6.753229640231162%2C111.0360452054126&radius=20000&business_status=OPERATIONAL&key=AIzaSyDikJA_zqvlFv4heu7UnWMht7j1JOTpiN8';
                break;
            case 'batikpekalongan':
                apiUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=kerajinan_batik_di_daerah_Pekalongan&location=-6.892020565996946%2C109.68239872415117&radius=20000&business_status=OPERATIONAL&key=AIzaSyDikJA_zqvlFv4heu7UnWMht7j1JOTpiN8';
                break;
            case 'batiksidoluhur':
                apiUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=kerajinan_batik_di_daerah_Banyumas&location=-7.531320107106469%2C109.27606211053724&radius=20000&business_status=OPERATIONAL&key=AIzaSyDikJA_zqvlFv4heu7UnWMht7j1JOTpiN8';
                break;
            default:
                return res.status(400).json({ error: 'Invalid Property Name' });
        }

        const response = await axios.get(apiUrl);
        const data = response.data;

        // You can do something with the data, for example, send it in the response
        return res.json(data);
    } catch (error) {
        console.error(error);

        // Send the error message in the response
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};

module.exports = { getUsers, Register, Login, editUser, deleteUser, getData }
