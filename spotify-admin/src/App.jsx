/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Route, Routes } from 'react-router-dom';
import AddAlbum from './pages/addAlbum';
import ListSong from './pages/ListSong';
import AddSong from './pages/AddSong';
import ListAlbum from './pages/ListAlbum';  // ✅ Add missing import
import Scrollbar from './components/Scrollbar';
import Navbar from './components/Navbar';

export const url = 'http://localhost:4000';

const App = () => {
  return (
    <div className='flex min-h-screen items-start'>
      <ToastContainer />
      <Scrollbar />
      <div className='flex-1 h-screen overflow-y-scroll bg-[#F3FFF7]'>
        <Navbar />
        <div className='pt-8 pl-5 sm:pt-12 sm:pl-12'>
          <Routes>
            <Route path='/add-album' element={<AddAlbum />} />
            <Route path='/add-song' element={<AddSong />} />
            <Route path='/list-album' element={<ListAlbum />} /> {/* ✅ Fixed */}
            <Route path='/list-song' element={<ListSong />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;

