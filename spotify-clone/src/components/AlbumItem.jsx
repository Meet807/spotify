/* eslint-disable no-unused-vars */
import React from 'react'
import { albumsData } from '../assets/assets/assets'
import { useNavigate } from 'react-router-dom';


// eslint-disable-next-line react/prop-types
const AlbumItem = ({image,name,desc,id}) => {

    const navigate = useNavigate()
 
    return (
        <div onClick={()=>navigate(`/album/${id}`)}  className="min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]">
          {image && <img src={image} alt={name} className="rounded" />}
          <p className="text-lg mb-1 font-bold mt-2">{name}</p>
          <p className="text-sm text-slate-200">{desc}</p>
          <p className="text-sm text-gray-500">{id}</p>
        </div>
      );
    };

export default AlbumItem