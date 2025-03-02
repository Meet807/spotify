import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import albumRouter from "./src/routes/albumRoute.js";
import songRouter from "./src/routes/songRoute.js";
import connectDB from "./src/config/mongodb.js";
import connectCloudinary from "./src/config/cloudinary.js";
import fs from 'fs';
import path from 'path';

dotenv.config();  // Load environment variables

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Middleware
app.use(cors());
app.use(express.json()); // Only use this once, no need to call it again later

// Connect to services
connectDB();
connectCloudinary();

// ✅ Serve static files from the uploads folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/album", albumRouter);
app.use("/api/song", songRouter);

// Test route for listing albums
app.get('/api/albums/list', (req, res) => {
    res.json({
        albums: [
            { id: 1, name: "Album 1", desc: "Description 1", },
            { id: 2, name: "Album 2", desc: "Description 2", }
        ]
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
