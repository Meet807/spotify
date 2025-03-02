import { addSong, listSong, deleteSong } from "../controllers/songController.js"; // Import the necessary controllers
import express from "express";
import upload from "../middleware/multer.js"; 
import { uploadToCloudinary } from "../controllers/songController.js";
// Import Cloudinary configuration functions

const songRouter = express.Router(); // Create a new Router instance

// Use upload.fields() for multiple file uploads
songRouter.post("/add", upload.fields([
    { name: "file", maxCount: 1 }, 
    { name: "image", maxCount: 1 }
]), async (req, res) => {
    try {
      const { name, desc, album } = req.body;
      if (!name || !desc || !req.files) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const imageUrl = req.files.image[0].path; // Cloudinary image URL
      const audioUrl = req.files.file[0].path; // Cloudinary audio URL

      // Save song details in the database
      const newSong = new Song({
        name,
        desc,
        image: imageUrl,
        file: audioUrl,
        album: album !== "none" ? album : null,
      });

      await newSong.save();
      res.json({ success: true, message: "Song added successfully!", song: newSong });

    } catch (error) {
      console.error("Upload Error:", error);
      res.status(500).json({ message: "Error adding song" });
    }
  });

// List songs
songRouter.get("/list", listSong);

// Delete song by ID (follow REST API best practices)
songRouter.delete("/:id", deleteSong);

export default songRouter;
