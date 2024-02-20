const fs = require("fs");
const asyncHandler = require("express-async-handler");

const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");

const uploadImages = asyncHandler(async (req, res) => {
  try {
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      // Upload image to Cloudinary
      const newpath = await cloudinaryUploadImg(path);
      urls.push(newpath);
      // Delete local file after uploading
      fs.unlinkSync(path);
    }
    res.json(urls);
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ error: "Failed to upload images" });
  }
});

const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    // Delete image from Cloudinary
    await cloudinaryDeleteImg(id);
    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
});

module.exports = {
  uploadImages,
  deleteImages,
};
