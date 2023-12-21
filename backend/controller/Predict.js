const axios = require('axios');
const FormData = require('form-data');
const { Storage } = require('@google-cloud/storage');
const uuid = require('uuid');

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT,
  private_key: process.env.GCLOUD_PRIVATE_KEY
}
);

const bucket = storage.bucket(process.env.GCS_BUCKET);
const unique = uuid.v1;

const prediction = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    // Tentukan nama file di bucket
    // const fileName = file.fieldname + '-' + uniqueSuffix + '.' + file.originalname;
    const fileName = `${unique()}-${req.file.originalname}`;

    // const fileUpload = bucket.file(fileName);
    const fileUpload = bucket.file(`predict/${fileName}`);

    const stream = fileUpload.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.mimetype,
      },
    });

    // Salin file yang diunggah ke Google Cloud Storage
    await new Promise((resolve, reject) => {
      stream.on('error', reject);
      stream.on('finish', resolve);
      stream.end(file.buffer);
    });

    // Dapatkan URL akses publik untuk file yang diunggah
    const publicUrl = `https://storage.googleapis.com/${bucket}/${fileName}`;

    const formData = new FormData();
    formData.append('fileUrl', publicUrl);

    const response = await axios.post('https://jelajahi-predict-model-rlr4zz5hfa-et.a.run.app/', formData, {
      headers: formData.getHeaders()
    });

    console.log(response.data);

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan saat mengunggah file');
  }
};

module.exports = {
  prediction
};