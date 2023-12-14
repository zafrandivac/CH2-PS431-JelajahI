const { Community } = require('../models/communityModel');

const addPost = async (req, res) => {
    const { description, place_name, location } = req.body;
    try {
        const community = await Community.create({
            description: description,
            placeName: place_name,
            location: location,
        })
        res.json({ msg: "Community berhasil ditambahkan" })
    } catch (error) {
        console.log(error);
    }
}

const getAllPost = async (req, res) => {
    try {
        const community = await Community.findAll({
            attributes: ['placeName', 'location', 'description']
        });
        res.json(community);
    } catch (error) {
        console.log(error);
    }
}

module.exports = { addPost, getAllPost }