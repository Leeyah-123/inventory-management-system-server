const cloudinary = require('cloudinary').v2;

require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploads = (file, folder) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(
      file,
      { use_filename: true, resource_type: 'auto', folder: folder },
      (error, result) => {
        resolve({
          url: result.secure_url,
          id: result.public_id,
        });
      },
      {}
    );
  });
};

exports.destroy = (public_id) => {
  return cloudinary.uploader.destroy(public_id, { resource_type: 'image' });
};
