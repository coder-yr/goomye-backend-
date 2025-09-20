import express from "express";
import multer from "multer";
import path from "path";
//creating router
const router = express.Router();

// Get the current directory

// Configure multer for file storage
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images/");
  },
  filename: (req, file, cb) => {
    const currentTimeMs = Date.now();
    cb(null, `${currentTimeMs}${path.extname(file.originalname)}`);
  },
});

const uploadImage = multer({ storage: imageStorage });

/////////////////////////// IMAGES ///////////////////
router.post("/upload/image", uploadImage.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    // Get the filename
    const uploadedFileName = req.file.filename;
    res
      .status(200)
      .json({ message: "Image Uploaded", filename: uploadedFileName });
  } catch (error) {
    return res.status(500).json({ message: "No file uploaded" });
  }
});

export default router;
