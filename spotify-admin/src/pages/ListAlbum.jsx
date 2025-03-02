/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { url } from "../App";
import { toast } from "react-toastify";
import { assets } from "../asset/assets";

const ListAlbum = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlbums = async () => {
    try {
      console.log("Fetching albums from:", `${url}/api/album/list`);
      const response = await axios.get(`${url}/api/album/list`);
      console.log("Fetched Albums:", response.data);

      if (response.data.success) {
        setData(response.data.albums);
      } else {
        toast.error("Failed to fetch albums.");
      }
    } catch (error) {
      console.error("Error fetching albums:", error);
      toast.error("Error occurred while fetching albums");
    } finally {
      setLoading(false);
    }
  };

  const removeAlbum = async (id) => {
    if (!id) {
      toast.error("Invalid album ID");
      return;
    }

    if (window.confirm("Are you sure you want to delete this album?")) {
      try {
        const response = await axios.delete(`${url}/api/album/${id}`);
        if (response.data.success) {
          toast.success("Album removed successfully!");
          setData(prevData => prevData.filter(album => album.id !== id));
        } else {
          toast.error("Failed to remove album.");
        }
      } catch (error) {
        console.error("Error Removing Album:", error);
        toast.error("Error occurred while removing album");
      }
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <div>
      <p className="text-xl font-semibold mb-4">All Albums List</p>
      {loading ? (
        <div className="grid place-items-center min-h-screen">
          <div className="w-16 h-16 border-4 border-gray-400 border-t-green-800 rounded-full animate-spin"></div>
        </div>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">No albums available</p>
      ) : (
        <div className="overflow-visible">
          <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
            <b>Image</b>
            <b>Name</b>
            <b>Description</b>
            <b>Action</b>
          </div>
          {data.map((item) => (
            <div 
              key={item.id} 
              className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] 
                        items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5"
            >
              <img 
  className="w-12 h-12 object-cover rounded" 
  src={item.image} 
  alt={item.name}
  onError={(e) => {
    if (!e.target.dataset.retry) {
      e.target.dataset.retry = "true"; // Prevents infinite loop
      e.target.src = assets.upload_area; // Use your local placeholder
    }
  }}
/>

              <p>{item.name}</p>
              <p>{item.desc}</p>
              <button 
                onClick={() => removeAlbum(item.id)} 
                className="text-red-500 hover:text-red-700 font-bold text-xl"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListAlbum;
