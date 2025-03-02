/* eslint-disable no-unused-vars */
import React from 'react'
import { assets } from '../../asset/assets'
import { useState } from 'react'
import axios from 'axios';
import { url } from '../../App';
import { toast } from 'react-toastify';

const AddAlbum = () => {

  const [image, setImage] = useState(false);
  const [color, setColor] = useState("#121212");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const OnSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('desc', desc);
      formData.append('image', image);
      formData.append('bgColor', color);

      const response = await axios.post(`${url}/api/album/add`, formData);

      // If we reach this point, it means the request was successful
      toast(" Album added successfully!", {
        type: "success",
        style: {
          backgroundColor: "#4CAF50",
          color: "white"
        },
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });

      // Reset form
      setDesc("");
      setImage(false);
      setName("");
      setColor("#121212");

    } catch (error) {
      console.error('Error:', error);
      toast.error("Error Occurred");
    }
    setLoading(false);
  }

  return loading ? (
    <div className="grid place-items-center min-h-screen">
      <div className="w-16 h-16 border-4 border-gray-400 border-t-green-800 rounded-full animate-spin"></div>
    </div>
  ) : (
    <form onSubmit={OnSubmitHandler} className='flex flex-col items-start gap-8 text-gray-600'>
      <div className='flex flex-col gap-4'>
        <p>Upload Image</p>
        <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' accept='image/*' hidden />
        <label htmlFor="image">
          <img className='w-24 cursor-pointer' src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
        </label>
      </div>

      <div className='flex flex-col gap-2.5'>
        <p>Album Name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='bg-transparent outline-green-600 border-2 border-gray-600 p-2.5 w-[max(40vw,250px)]' type="text" placeholder='Type here' />
      </div>

      <div className='flex flex-col gap-2.5'>
        <p>Album Description</p>
        <input onChange={(e) => setDesc(e.target.value)} value={desc} className='bg-transparent outline-green-600 border-2 border-gray-600 p-2.5 w-[max(40vw,250px)]' type="text" placeholder='Type here' />
      </div>

      <div className='flex flex-col gap3'>
        <p>Background Color</p>
        <input onChange={(e) => setColor(e.target.value)} value={color} type="color" />
      </div>

      <button type='submit' className='text-base bg-black text-white py-2.5 px-14 cursor-pointer rounded-2xl'>ADD</button>
    </form>
  )
}

export default AddAlbum;