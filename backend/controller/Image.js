const processFile = require('../middleware/upload');
const { format } = require("util");
const { Storage } = require('@google-cloud/storage');

const storeImage = new Storage({
    keyFilename: 'ch2-ps431-jelajahi-credentials.json',
    projectId: "ch2-ps431-jelajahi"
});

const jelajahiBucket = storeImage.bucket('staging.ch2-ps431-jelajahi.appspot.com');

const uploadImage = async (req, res) => {
    try {
        await processFile(req, res);

        if (!req.file) {
            return res.status(400).send({ msg: "Please upload a file!" });
        }

        const blob = jelajahiBucket.file(req.file);
        const blobStream = blob.createWriteStream({
            resumable: false
        });

        blobStream.on("error", (err) => {
            res.status(500).send({ message: err.message });
        });

        blobStream.on("finish", async (data) => {
            const publicUrl = format(`https://storage.googleapis.com/${jelajahiBucket.name}/${blob.name}`);

            try {
                await jelajahiBucket.file(req.file).makePublic();
            } catch {
                return res.status(500).send({
                    message: `Uploaded the file successfully: ${req.file}, but public access is denied!`,
                    url: publicUrl,
                });
            }

            res.status(200).send({
                message: "Uploaded the file successfully: " + req.file,
                url: publicUrl,
            });
        })

        blobStream.end(req.file.buffer);
    } catch (error) {
        res.status(500).send({ message: `Could not upload the file` })
    }
}

const getListImages = async (req, res) => {
    try {
        const [files] = await jelajahiBucket.getFiles();
        let fileInfos = [];

        files.forEach((file) => {
            fileInfos.push({
                name: file.name,
                url: file.metadata.mediaLink,
            });
        });

        res.status(200).send(fileInfos);
    } catch (err) {
        console.log(err);

        res.status(500).send({
            message: "Unable to read list of images!",
        });
    }
};

const download = async (req, res) => {
    try {
        const [metaData] = await jelajahiBucket.file(req.params.name).getMetadata();
        res.redirect(metaData.mediaLink);

    } catch (err) {
        res.status(500).send({
            message: "Could not download the file. " + err,
        });
    }
};

module.exports = { uploadImage, getListImages, download }