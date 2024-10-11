// FileUploaderController.js
const { uploadToCloudinary } = require("../utils/cloudinaryConfig");
const fs = require("fs");
const User = require("../models/User"); // Assuming Mongoose or similar ORM
const Member = require("../models/Member");
const Coach = require("../models/Coach");

const FileUploaderController = {};

/**
 * Upload image and update relevant resource
 * @param {string} resource_id - The ID of the resource (User, Member, Coach)
 * @param {string} resource_type - The type of resource ("user", "member", "coach")
 * @param {object} file - The file object from the request
 * @returns {object} - Response with success message and URL of uploaded image
 */
FileUploaderController.uploadImage = async (req, res) => {
  const { resource_id, resource_type } = req.body;

  if (!resource_id || !resource_type) {
    return res.status(400).json({
      success: false,
      message: "Resource ID and Resource Type are required",
    });
  }

  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "Image file is required" });
  }

  try {
    // Upload image to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(req.file.path);

    // Delete the file from the server after uploading to Cloudinary
    fs.unlinkSync(req.file.path);

    // Update the resource with the new image URL based on resource_type
    let updateResult;
    switch (resource_type.toLowerCase()) {
      case "user":
        updateResult = await User.findByIdAndUpdate(
          resource_id,
          { logo: cloudinaryResult },
          { new: true }
        );
        break;

      case "member":
        updateResult = await Member.findByIdAndUpdate(
          resource_id,
          { profile_url: cloudinaryResult },
          { new: true }
        );
        break;

      case "coach":
        updateResult = await Coach.findByIdAndUpdate(
          resource_id,
          { profile_url: cloudinaryResult },
          { new: true }
        );
        break;

      default:
        return res
          .status(400)
          .json({ success: false, message: "Invalid resource type" });
    }

    // If no record found
    if (!updateResult) {
      return res.status(404).json({
        success: false,
        message: `${resource_type} with ID ${resource_id} not found`,
      });
    }

    // Send response with Cloudinary URL
    res.json({
      success: true,
      message: `${resource_type} updated successfully!`,
      url: cloudinaryResult.secure_url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = FileUploaderController;
