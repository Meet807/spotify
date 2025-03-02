/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { assets } from "../assets/assets/assets"; // ✅ Import assets for fallback image

const SongItem = ({ name, image, desc, id }) => {
    const { playWithId } = useContext(PlayerContext);

    return (
        <div
            onClick={() => playWithId(id)}
            className="min-w-[180px] p-2 px-3 cursor-pointer rounded hover:bg-[#ffffff26]"
        >
            <img 
                className="rounded" 
                src={image || assets.placeholder_image}  // ✅ Use a local fallback image
                alt={name || "Song Cover"} 
                onError={(e) => { e.target.src = assets.placeholder_image; }} // ✅ Local fallback to prevent infinite loop
            />

            <p className="text-lg mb-1 font-bold mt-2">{name}</p>
            <p className="text-sm text-slate-200">{desc}</p>
        </div>
    );
};

export default SongItem;
