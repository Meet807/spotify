import songModel from "../models/songModel.js";
import { getAudioDurationInSeconds } from 'get-audio-duration';
import fs from 'fs';
import cloudinary from "../config/cloudinary.js";

const calculateDuration = async (filePath) => {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return "0:00";
    }
    
    const durationInSeconds = await getAudioDurationInSeconds(filePath);
    
    // Convert seconds to mm:ss format
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  } catch (error) {
    console.error("Error calculating duration:", error);
    return "0:00"; // Return default if calculation fails
  }
};

const addSong = async (req, res) => {
  try {
      console.log("Received Request Body:", req.body);  // Debugging
      console.log("Received Files:", req.files);  // Debugging

      const { name, desc, album } = req.body;

      // Validate required fields
      if (!name || !desc || !album) {
          return res.status(400).json({ success: false, message: "Missing required fields" });
      }

      if (!req.files || (!req.files["image"] && !req.files["file"])) {
          return res.status(400).json({ success: false, message: "No files uploaded" });
      }

      let imageUrl = "";
      let songUrl = "";

      // Upload image if provided
      if (req.files["image"]) {
          console.log("Uploading image to Cloudinary...");
          try {
              const result = await cloudinary.uploader.upload(req.files["image"][0].path, {
                  folder: "uploads/images",
                  resource_type: "image"
              });
              imageUrl = result.secure_url;
          } catch (error) {
              console.error("Error uploading image:", error);
              return res.status(500).json({ success: false, message: "Image upload failed" });
          }
      }

      // Upload song if provided
      if (req.files["file"]) {
          console.log("Uploading song to Cloudinary...");
          try {
              const result = await cloudinary.uploader.upload(req.files["file"][0].path, {
                  folder: "uploads/audios",
                  resource_type: "video"
              });
              songUrl = result.secure_url;
          } catch (error) {
              console.error("Error uploading song:", error);
              return res.status(500).json({ success: false, message: "Song upload failed" });
          }
      }

      // Save song to MongoDB
      const song = new songModel({ name, desc, album, image: imageUrl, file: songUrl });
      await song.save();

      res.status(201).json({ success: true, message: "Song added successfully", song });
  } catch (error) {
      console.error("Error adding song:", error);
      res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};


  


const listSong = async (req, res) => {
    try {
        const songs = await songModel.find();
        const formattedSongs = songs.map(song => ({
            id: song._id,
            name: song.name,
            desc: song.desc,
            image: song.image.includes("cloudinary")  
                ? song.image  
                : `https://res.cloudinary.com/dwijxlygp/image/upload/${song.image.replace(/\\/g, "/")}`,
            file: song.file.includes("cloudinary")  
                ? song.file  
                : `https://res.cloudinary.com/dwijxlygp/video/upload/${song.file.replace(/\\/g, "/")}`
        }));
        res.json({ songs: formattedSongs });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch songs" });
    }
};





const removeSong = async (req, res) => {
    try {
        const { id } = req.body;
        await songModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Song removed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error removing song", error: error.message });
    }
};

import Song from "../models/songModel.js";

const deleteSong = async (req, res) => {
  try {
    const { id } = req.params; // ✅ Extracting `id` properly

    if (!id) {
      return res.status(400).json({ success: false, message: "Invalid song ID" });
    }

    console.log("Deleting song with ID:", id); // ✅ Debugging log

    const song = await Song.findById(id);

    if (!song) {
      return res.status(404).json({ success: false, message: "Song not found" });
    }

    await Song.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Song deleted successfully" });

  } catch (error) {
    console.error("Error deleting song:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

const uploadToCloudinary = async (file, folder) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "spotify_preset"); // Replace with your actual Cloudinary upload preset
  formData.append("folder", folder);

  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dwijxlygp/upload", // Your Cloudinary URL
      formData
    );
    if (response.data.secure_url) {
      return response.data.secure_url; // Return the URL
    } else {
      console.error("Cloudinary upload failed, no secure URL");
      return null;
    }
  } catch (error) {
    console.error("Cloudinary Upload Failed", error);
    return null;
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  // Upload image and file to Cloudinary
  const imageUrl = await uploadToCloudinary(songData.image, "album_images");
  const songUrl = await uploadToCloudinary(songData.file, "songs");

  if (!imageUrl || !songUrl) {
    console.error("Failed to upload files");
    return;
  }

  // Prepare formData to send to backend
  const formData = new FormData();
  formData.append("name", songData.name);
  formData.append("desc", songData.desc);
  formData.append("image", imageUrl); // Send the URL from Cloudinary
  formData.append("file", songUrl);   // Send the URL from Cloudinary
  formData.append("album", songData.album);

  try {
    const response = await axios.post("http://localhost:4000/api/song/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("Song Added Successfully", response.data);
  } catch (error) {
    console.error("Error adding song:", error.response ? error.response.data : error);
  }
};





export { addSong, listSong, removeSong , deleteSong, uploadToCloudinary};