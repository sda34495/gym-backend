// routes.js or app.js

const express = require("express");
const { upload } = require("../utils/cloudinaryConfig");
const FileUploaderController = require("../controllers/FileUploaderController");

const router = express.Router();

// Route to handle image upload and update resource (user, member, coach)
router.post(
  "/upload-image",
  upload.single("image"),
  FileUploaderController.uploadImage
);

module.exports = router;
