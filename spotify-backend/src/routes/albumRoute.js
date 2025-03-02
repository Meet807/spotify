import { addAlbum, listAlbum, deleteAlbum } from "../controllers/albumController.js";
import express from "express";
import upload from "../middleware/multer.js";

const albumRouter = express.Router();

// Use `upload.single("image")` to handle image uploads
albumRouter.post("/add", upload.single("image"), addAlbum);
albumRouter.get("/list", listAlbum);
albumRouter.delete("/:id", deleteAlbum);

export default albumRouter;
