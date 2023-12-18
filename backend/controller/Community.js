const { Community } = require('../models/communityModel');
const { Storage } = require('@google-cloud/storage');
const multer = require('multer');

const storage = new Storage({
    keyFilename: 'ch2-ps431-jelajahi-credentials.json',
});

const upload = multer({
    storage: multer.memoryStorage(), // You can use diskStorage() if you want to save temporarily on disk
});

const addPost = async (req, res) => {
    const { description, place_name, location } = req.body;
    try {
        const community = await Community.create({
            description: description,
            placeName: place_name,
            location: location,
        });

        const file = req.file;

        if (file) {
            const bucketName = 'jelajahi';
            const gcsFileName = `user/${Date.now()}_${file.originalname}`;
            const fileOptions = {
                destination: gcsFileName,
                metadata: {
                    contentType: file.mimetype,
                },
            };

            await storage.bucket(bucketName).upload(file.buffer, fileOptions);

            // Add the GCS URL to the community object or store it as needed
            community.reviewPictureUrl = `https://storage.googleapis.com/${bucketName}/${gcsFileName}`;
            await community.save();
        }

        res.json({ msg: 'Community berhasil ditambahkan', community });
    } catch (error) {
        console.error('Error during community creation:', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};


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