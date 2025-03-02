import albumModel from "../models/albumModel.js";
import cloudinary from "../config/cloudinary.js";

const addAlbum = async (req, res) => {
  try {
      const { name, desc, bgColor } = req.body;

      // Upload image to Cloudinary
      let imageUrl = "";
      if (req.file) {
          const result = await cloudinary.uploader.upload(req.file.path, {
              folder: "uploads/images",
              resource_type: "image"
          });
          imageUrl = result.secure_url;
      }

      // Save to MongoDB
      const album = new Album({ name, desc, bgColor, image: imageUrl });
      await album.save();

      res.status(201).json({ success: true, message: "Album added successfully", album });
  } catch (error) {
      console.error("Error adding album:", error);
      res.status(500).json({ success: false, message: "Server error" });
  }
};

const listAlbum = async (req, res) => {
  try {
    const albums = await albumModel.find();
    if (!albums || albums.length === 0) {
      return res.status(200).json({ success: true, albums: [] });
    }

    const formattedAlbums = albums.map(album => ({
      id: album._id,
      name: album.name,
      desc: album.desc,
      image: album.image.includes("cloudinary")
        ? album.image
        : `https://res.cloudinary.com/dwijxlygp/image/upload/${album.image.replace(/\\/g, "/")}`,
    }));

    res.status(200).json({ success: true, albums: formattedAlbums });
  } catch (error) {
    console.error("Error fetching albums:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: "Invalid album ID" });
    }

    console.log("Deleting album with ID:", id);
    const album = await albumModel.findById(id);

    if (!album) {
      return res.status(404).json({ success: false, message: "Album not found" });
    }

    await albumModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Album deleted successfully" });

  } catch (error) {
    console.error("Error deleting album:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

export { addAlbum, listAlbum, deleteAlbum };
