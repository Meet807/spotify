import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
    name: { type: String, required: true },  // ✅ Required field
    desc: { type: String, required: true },  // ✅ Required field
    file: { type: String, required: true },  // ✅ Required: Ensure file is uploaded
    image: { type: String, required: true }, // ✅ Required: Ensure image is uploaded
    album: { type: mongoose.Schema.Types.ObjectId, ref: "Album", default: null } // ✅ Allow `null` album
});

const Song = mongoose.model("Song", songSchema);
export default Song;
