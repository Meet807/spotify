/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import {assets} from '../assets/assets/assets'
import { useNavigate } from "react-router-dom";


const Scrollbar = () => {

    const navigate = useNavigate();
    return (
        <div className='w-[20%] h-full p-4 flex flex-col gap-3 text-white bg-[#000] hidden lg:flex'>
            {/* Top Section */}
            <div className='bg-[#121212] h-[15%] rounded flex flex-col justify-around'>
                <div onClick={()=>navigate('/')} className='flex items-center gap-3 pl-8 cursor-pointer '>
                    <img className='w-6' src={assets.home_icon} alt="" /> 
                    <p className='font-bold'>Home</p>
                </div>
                
                <div className='flex items-center gap-3 pl-8 cursor-pointer'>
                    <img className='w-6' src={assets.search_icon} alt="" /> 
                    <p className='font-bold'>Search</p>
                </div>
            </div>

            {/* Library Section */}
            <div className='bg-[#121212] h-[85%] rounded'>
                <div className='p-4 flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <img className='w-8' src={assets.stack_icon} alt="" />
                        <p className='font-semibold'>Your Library</p>
                    </div>
                    <div className='flex items-center gap-3'>
                        <img className='w-5' src={assets.arrow_icon} alt="" />
                        <img className='w-5' src={assets.plus_icon} alt="" />
                    </div>
                </div>

                {/* Playlist & Podcast Sections */}
                <div className='mt-4 space-y-4'>
                    <div className='p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4'>
                        <h1 className="font-semibold">Create your first playlist</h1>
                        <p className='font-light'>It's easy, we'll help you.</p>
                        <button className='mt-3 px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4'>Create playlist</button>
                    </div>

                    <div className='p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4'>
                        <h1 className="font-semibold">Find some podcasts to follow</h1>
                        <p className='text-gray-400 text-xs'>We'll keep you updated with new episodes!</p>
                        <button className='mt-3 px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4'>Browse podcasts</button>
                    </div>
                </div>
            </div>
        </div>
      )
    }

export default Scrollbar
