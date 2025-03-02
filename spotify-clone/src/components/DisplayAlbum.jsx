/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState, useMemo } from 'react';
import Navbar from './Navbar';
import { useParams } from 'react-router-dom';
import { albumsData, songsData } from '../assets/assets/assets';
import { PlayerContext } from '../context/PlayerContext';
import { assets } from '../assets/assets/assets';

const DisplayAlbum = () => {
    const { id } = useParams();
    const { playWithId } = useContext(PlayerContext);
    const [albumData, setAlbumData] = useState(null);
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        const selectedAlbum = albumsData?.find(album => album.id?.toString() === id);
        if (selectedAlbum) {
            setAlbumData(selectedAlbum);
            setSongs(songsData.filter(song => song.albumId?.toString() === selectedAlbum.id?.toString()));
        }
    }, [id]);

    const memoizedAlbumData = useMemo(() => albumData, [albumData]);
    const memoizedSongs = useMemo(() => songs, [songs]);

    if (!memoizedAlbumData) {
        return <p className="text-white text-center mt-10">Album not found.</p>;
    }

    return (
        <>
            <Navbar />
            <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
                <img className="w-48 rounded" 
                     src={memoizedAlbumData?.image || assets.placeholder_image} 
                     alt={memoizedAlbumData?.name || "Album Cover"} 
                     onError={(e) => e.target.src = assets.placeholder_image} 
                />
                <div className="flex flex-col">
                    <p>Playlist</p>
                    <h2 className="text-5xl font-bold mb-4 md:text-7xl">{memoizedAlbumData.name}</h2>
                    <h4>{memoizedAlbumData.desc}</h4>
                    <p className="mt-1">
                        <img className="inline-block w-7" src={assets.spotify_logo} alt="Spotify Logo" />
                        <b className="p-2px">Spotify</b>
                        • 1,323,154 likes
                        <b> • {memoizedSongs.length} songs,</b> about 2hr 30min
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7]">
                <p><b className="mr-4">#</b>Title</p>
                <p>Album</p>
                <p className="hidden sm:block">Date Added</p>
                <img className="m-auto w-4" src={assets.clock_icon} alt="Clock Icon" />
            </div>
            <hr />

            {memoizedSongs.length > 0 ? (
                memoizedSongs.map((item, index) => (
                    <div onClick={() => playWithId(item.id)} key={index} className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b]">
                        <p className="text-white">
                            <b className="mr-4 text-[#a7a7a7]">{index + 1}</b>
                            <img 
                                src={item.image || assets.placeholder_image} 
                                alt={item.name || "Album Cover"} 
                                onError={(e) => e.target.src = assets.placeholder_image} 
                            />
                            {item.name}
                        </p>
                        <p className="text-[15px]">{memoizedAlbumData.name}</p>
                        <p className="text-[15px] hidden sm:block">5 days ago</p>
                        <p className="text-[15px] text-center">{item.duration}</p>
                    </div>
                ))
            ) : (
                <p className="text-white text-center mt-5">No songs found.</p>
            )}
        </>
    );
};

export default DisplayAlbum;
