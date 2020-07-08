const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

const folder = 'assets';

const public_id = (req, file) => {
  const id = crypto.randomBytes(5).toString('hex');
  const filename = file.originalname.split('.')[0];
  return `${filename}-${id}`;
};

exports.avatar = multer({
  storage: new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder,
      public_id,
      transformation: [{ width: 100, height: 100, crop: 'limit' }],
    },
  }),
});

exports.file = multer({
  storage: new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder,
      public_id,
    },
  }),
});
