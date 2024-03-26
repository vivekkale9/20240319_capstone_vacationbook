const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: 'doqfmpage',
    api_key: '725395147522914',
    api_secret: 'o_CAuh0zFcJCn9Zs9Bo3lkqz0y4'
});

// here we created a storage space in cloudinary.
// where we've defined folder name and its allowed format.
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'vacationbook',
      allowedFormats : ["png", "jpg", "jpeg"]
    },
  });

module.exports = {cloudinary,storage};