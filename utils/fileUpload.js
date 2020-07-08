const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'woufu',
  api_key: '534334264257422',
  api_secret: 'sVV07G0T2x5Z0VVMa9m23iK2Wdk',
});

module.exports = cloudinary;
