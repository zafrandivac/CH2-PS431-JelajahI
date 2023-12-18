const axios = require('axios');
const { Storage } = require('@google-cloud/storage');
var path = require('path');

const storage = new Storage({
    projectId: process.env.GCLOUD_PROJECT,
    credentials: {
        private_key: process.env.GCLOUD_PRIVATE_KEY
    }
});

const bucket = storage.bucket(process.env.GCS_BUCKET);

const { Batik } = require("../models/batikModel");

const predictBatik = async (req, res) => {

    if (req.file) {
        const ext = path.extname(req.file.originalname).toLowerCase();

        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.webp') {
            return res.status(404).json({
                message: 'File yang diunggah harus memiliki format .png, .jpg, .jpeg, .webp'
            });
        }

        const newFileName = Date.now() + "-" + req.file.originalname;
        const blob = bucket.file(`predict/${newFileName}`);
        const blobStream = blob.createWriteStream();

        blobStream.on('error', (error) => {
            return res.status(400).json({ message: error });
        });

        blobStream.on('finish', async () => {
            const filename = blob.name.replaceAll('predict/', '');;

            try {
                const getPrediction = await axios.post(process.env.API_PREDICT, {
                    filename: filename
                });
                const predictedBatik = getPrediction.data;

                const findBatik = await Batik.findOne({
                    where: {
                        nama: predictedBatik.nama
                    }
                });

                if (!findBatik) {
                    const batik = await Batik.create(predictedBatik);
                    return res.json({ msg: 'Jenis batik tidak ditemukan' });
                }

                res.json(findBatik);
            } catch (error) {
                console.log(error);
                return res.status(400).json({ msg: 'Tidak terdeteksi' });
            }
        });

        blobStream.end(req.file.buffer);
    }
}

module.exports = { predictBatik }