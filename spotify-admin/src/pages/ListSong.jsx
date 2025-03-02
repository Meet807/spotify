/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { url } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../asset/assets';

const ListSong = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSongs = async () => {
    try {
      const response = await axios.get(`${url}/api/song/list`);
      
      // Log the entire structure
      console.log("API Response structure:", response.data);
      
      let songsArray;
      if (response.data.songs) {
        songsArray = response.data.songs;
      } else if (Array.isArray(response.data)) {
        songsArray = response.data;
      } else {
        toast.error("Unexpected data structure from API");
        setLoading(false);
        return;
      }
      
      // Check ID structure in the first song
      if (songsArray.length > 0) {
        const firstSong = songsArray[0];
        console.log("First song ID structure:", {
          _id: firstSong._id,
          id: firstSong.id,
          songId: firstSong.songId,
          fullObject: firstSong
        });
      }
      
      setData(songsArray);
    } catch (error) {
      console.error("Error Fetching Songs:", error);
      toast.error("Error occurred while fetching songs");
    } finally {
      setLoading(false);
    }
  };
  
  const removeSong = async (item) => {
    // Extract ID based on what's available
    const id = item._id || item.id || item.songId;
    
    console.log("ITEM BEING DELETED:", item);
    console.log("ID BEING USED:", id);
    
    if (!id) {
      toast.error("Invalid song ID. Debug info logged to console");
      console.error("Song object without valid ID:", item);
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      try {
        const response = await axios.delete(`${url}/api/song/${id}`);
        
        if (response.data.success) {
          toast.success("Song removed successfully!");
          setData(prevData => prevData.filter(song => 
            (song._id !== id && song.id !== id && song.songId !== id)
          ));
        } else {
          toast.error(response.data.message || "Failed to remove song");
          console.error("API error:", response.data);
        }
      } catch (error) {
        console.error("Error details:", error?.response?.data || error.message);
        toast.error(`Error: ${error?.response?.data?.message || error.message}`);
      }
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  if (loading) {
    return (
      <div className="grid place-items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-gray-400 border-t-green-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xl font-semibold mb-4">All Songs List</p>
      <div className="overflow-visible">
        <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
          <b>Image</b>
          <b>Name</b>
          <b>Album</b>
          <b>Duration</b>
          <b>Action</b>
        </div>

        {data.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">No songs available</p>
        ) : (
          data.map((item, index) => (
            <div 
              key={item._id || item.id || `song-${index}`} 
              className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] 
                        items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5"
            >
              <img 
                className="w-12 h-12 object-cover rounded" 
                src={item.image?.startsWith("http") ? item.image : `${url}/${item.image}`} 
                alt={item.name}
                onError={(e) => {
                  e.target.src = assets.upload_area;
                }}
              />
              <p>{item.name}</p>
              <p>{item.album?.name || 'No Album'}</p>
              <p>{item.duration || '00:00'}</p>
              <button 
                onClick={() => removeSong(item)} // Pass the entire item object
                className="text-red-500 hover:text-red-700 font-bold text-xl"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListSong;
