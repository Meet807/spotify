/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { createContext, useRef, useState, useEffect } from "react";
import axios from 'axios';

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
    const audioRef = useRef(new Audio());
    const seekBg = useRef();
    const seekBar = useRef();

    const url = 'http://localhost:4000';  // Ensure this is the correct URL for your backend

    const [songsData, setSongsData] = useState([]);
    const [albumsData, setAlbumsData] = useState([]);
    const [track, setTrack] = useState(null);
    const [playStatus, setPlayStatus] = useState(false);
    const [time, setTime] = useState({
        currentTime: { second: 0, minute: 0 },
        totalTime: { second: 0, minute: 0 },
    });

    // Play/Pause functionality
    const play = () => {
        if (!track || !track.file) return;
        
        if (!audioRef.current.src || !audioRef.current.src.includes(track.file)) {
            audioRef.current.src = track.file;
            audioRef.current.currentTime = 0;
        }
        
        audioRef.current.play()
            .then(() => setPlayStatus(true))
            .catch(error => console.error("Error playing audio:", error));
    };

    const pause = () => {
        audioRef.current.pause();
        setPlayStatus(false);
    };

    useEffect(() => {
        setTimeout(() => {
            audioRef.current.ontimeupdate = () => {
                if (seekBar.current && audioRef.current.duration) {
                    seekBar.current.style.width = (Math.floor(audioRef.current.currentTime / audioRef.current.duration * 100)) + '%';
                }
                setTime({
                    currentTime: {
                        second: Math.floor(audioRef.current.currentTime % 60),
                        minute: Math.floor(audioRef.current.currentTime / 60)
                    },
                    totalTime: {
                        second: Math.floor(audioRef.current.duration % 60) || 0,
                        minute: Math.floor(audioRef.current.duration / 60) || 0
                    }
                });
            };
        }, 1000);
    }, [audioRef]);

    useEffect(() => {
        getSongsData(); 
        getAlbumsData();
    }, []);
        
    const handleSeek = (event) => {
        const rect = seekBg.current.getBoundingClientRect();
        const seekPosition = (event.clientX - rect.left) / rect.width;
        const newTime = seekPosition * audioRef.current.duration;

        if (!isNaN(newTime) && isFinite(newTime)) {
            audioRef.current.currentTime = newTime;
        }
    };

    const getSongsData = async () => {
        try {
            const response = await axios.get(`${url}/api/song/list`);
            console.log("Fetched Songs Response:", response.data);
    
            if (response.data.songs && response.data.songs.length > 0) {
                setSongsData(response.data.songs);
                setTrack(response.data.songs[0]); // ✅ Ensure track is set
            } else {
                console.error("No songs found in API response");
            }
        } catch (error) {
            console.error("Error fetching songs data:", error);
        }
    };

    const getAlbumsData = async () => {
        try {
            const response = await axios.get(`${url}/api/album/list`);
            setAlbumsData(response.data.albums || []);
        } catch (error) {
            console.error("Error fetching albums data:", error);
        }
    };

    const playWithId = (id) => {
        const selectedTrack = songsData.find(song => song.id === id);
        if (selectedTrack) {
            setTrack(selectedTrack);
            play();
        }
    };

    const previous = () => {
        const currentIndex = songsData.findIndex(song => song.id === track?.id);
        if (currentIndex > 0) {
            setTrack(songsData[currentIndex - 1]);
            play();
        }
    };

    const next = () => {
        const currentIndex = songsData.findIndex(song => song.id === track?.id);
        if (currentIndex < songsData.length - 1) {
            setTrack(songsData[currentIndex + 1]);
            play();
        }
    };

    const contextValue = {
        audioRef,
        seekBar,
        seekBg,
        track,
        playStatus,
        time,
        play,
        pause,
        handleSeek,
        playWithId,
        previous,
        next,
        songsData,
        albumsData,
    };

    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    );
};

export default PlayerContextProvider;
