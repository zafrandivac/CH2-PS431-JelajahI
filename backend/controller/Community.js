const { Community } = require('../models/communityModel');

const addPost = async (req, res) => {
    const { description, place_name, location } = req.body;
    try {
        const community = await Community.create({
            description: description,
            placeName: place_name,
            location: location,
        });

        res.json({ msg: 'Community berhasil ditambahkan', community });
    } catch (error) {
        console.error('Error during community creation:', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

const getAllPost = async (req, res) => {
    try {
        const community = await Community.findAll({
            attributes: ["placeName", "location", "description"]
        });
        res.json(community);
    } catch (error) {
        console.log(error);
    }
}

const editPost = async (req, res) => {
    const { id, description, place_name } = req.body;
    try {
        const community = await Community.update({
            placeName: place_name,
            description: description,
        }, {
            where: {
                id: id
            }
        });
        res.json({ msg: "Post anda berhasil diubah" })
    } catch (error) {
        console.log(error);
    }
}

const deletePost = async (req, res) => {
    const { id } = req.body;
    try {
        const community = await Community.destroy({
            where: {
                id: id
            }
        });
        res.json({ msg: "Post anda berhasil dihapus" })
    } catch (error) {
        console.log(error)
    }
}

module.exports = { addPost, getAllPost, editPost, deletePost }