const multer = require('multer');
const { lessonStorage } = require('../config/cloudinary');

// Handles multipart/form-data uploads and streams them directly to
// Cloudinary via multer-storage-cloudinary (no local disk writes).
const upload = multer({
  storage: lessonStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB (video-friendly)
});

module.exports = upload;
