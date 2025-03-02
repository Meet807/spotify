/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { assets } from "../asset/assets";
import axios from "axios";
import { url } from "../App";
import { toast } from "react-toastify";

// Add error interceptor for better debugging
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.log('Server response error data:', error.response.data);
      console.log('Server response error status:', error.response.status);
    }
    return Promise.reject(error);
  }
);

const AddSong = () => {
  const [image, setImage] = useState(null);
  const [song, setSong] = useState(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [album, setAlbum] = useState("none");
  const [loading, setLoading] = useState(false);
  const [albumData, setAlbumData] = useState([]);

  useEffect(() => {
    const loadAlbumData = async () => {
      try {
        const response = await axios.get(`${url}/api/album/list`);
        if (response.data.albums) {
          setAlbumData(response.data.albums);
        } else {
          toast.error("No albums found.");
        }
      } catch (error) {
        console.error("Error fetching albums:", error);
        toast.error("Error loading albums");
      }
    };
    loadAlbumData();
  }, []);

  
  
  const OnSubmitHandler = async (e) => {
    e.preventDefault();

    if (!name || !desc || !image || !song) {
      toast.error("Please fill in all fields!");
      return;
    }

    setLoading(true);

    try {
      // Create FormData with actual file objects
      const formData = new FormData();
      formData.append("name", name);
      formData.append("desc", desc);
      formData.append("image", image); // Actual image file
      formData.append("file", song);   // Actual song file
      
      // Only include album if it's not "none"
      if (album !== "none") {
        formData.append("album", album);
      }

      console.log("Submitting with actual files:", {
        name,
        desc,
        "image filename": image.name,
        "song filename": song.name,
        album: album !== "none" ? album : "Not selected"
      });

      // Don't set Content-Type header - axios will set the correct boundary
      const response = await axios.post(`${url}/api/song/add`, formData);

      if (response.data.success) {
        toast.success("Song added successfully!");
        // Reset form
        setName("");
        setDesc("");
        setAlbum("none");
        setImage(null);
        setSong(null);
      } else {
        toast.error(response.data.message || "Error adding song");
      }
    } catch (error) {
      console.error("Error adding song:", error);
      // Show the actual error message from the server if available
      const errorMessage = 
        typeof error.response?.data === 'string' && error.response?.data.includes('<!DOCTYPE html>') 
          ? "Server error: Check your backend logs" 
          : error.response?.data?.message || 
            error.response?.data?.error || 
            "Error adding song";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <div className="grid place-items-center min-h-screen">
      <div className="w-16 h-16 border-4 border-gray-400 border-t-green-800 rounded-full animate-spin"></div>
    </div>
  ) : (
    <form onSubmit={OnSubmitHandler} className="flex flex-col items-start gap-8 text-gray-600">
      <div className="flex gap-8">
        {/* Upload Song */}
        <div className="flex flex-col gap-4">
          <p>Upload Song</p>
          <input onChange={(e) => setSong(e.target.files[0])} type="file" id="song" accept="audio/*" hidden />
          <label htmlFor="song">
            <img src={song ? assets.upload_added : assets.upload_song} className="w-24 cursor-pointer" alt="Song Upload" />
          </label>
          {song && <span className="text-sm text-green-600">{song.name}</span>}
        </div>

        {/* Upload Image */}
        <div className="flex flex-col gap-4">
          <p>Upload Image</p>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" accept="image/*" hidden />
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} className="w-24 h-24 object-cover cursor-pointer" alt="Image Upload" />
          </label>
          {image && <span className="text-sm text-green-600">{image.name}</span>}
        </div>
      </div>

      {/* Song Name */}
      <div className="flex flex-col gap-2.5 w-full max-w-[max(40vw,250px)]">
        <p>Song Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="bg-transparent outline-green-600 border-2 border-gray-800 p-2.5 w-full"
          placeholder="Type Here"
          type="text"
          required
        />
      </div>

      {/* Song Description */}
      <div className="flex flex-col gap-2.5 w-full max-w-[max(40vw,250px)]">
        <p>Song Description</p>
        <input
          onChange={(e) => setDesc(e.target.value)}
          value={desc}
          className="bg-transparent outline-green-600 border-2 border-gray-800 p-2.5 w-full"
          placeholder="Type Here"
          type="text"
          required
        />
      </div>

      {/* Album Selection */}
      <div className="flex flex-col gap-2.5">
        <p>Album</p>
        <select
          onChange={(e) => setAlbum(e.target.value)}
          value={album}
          className="bg-transparent outline-green-600 border-2 border-gray-800 p-2.5 w-[150px]"
        >
          <option value="none">None</option>
          {albumData.map((item, index) => (
            <option key={item._id || index} value={item._id}>
              {item.name || "Unnamed Album"}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        className="text-base bg-black text-white py-2.5 px-14 cursor-pointer rounded-2xl hover:bg-green-800 transition-colors"
      >
        ADD SONG
      </button>
    </form>
  );
};

export default AddSong;