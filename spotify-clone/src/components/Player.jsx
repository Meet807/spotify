/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import { assets } from "../assets/assets/assets";
import { PlayerContext } from "../context/PlayerContext";

const Player = () => {
    const {
        track,
        seekBar,
        seekBg,
        playStatus,
        time,
        handleSeek,
        play,
        pause,
        previous,
        next
    } = useContext(PlayerContext);

    return track ?  (
        <div className="h-[10%] bg-black flex justify-between items-center text-white px-4">
            {/* Song Info */}
            <div className="hidden lg:flex items-center gap-4">
                <img className="w-12 h-12 object-cover" src={track?.image} alt="Track Cover" />
                <div>
                    <p>{track?.name || "No Song Selected"}</p>
                    <p>{track?.desc?.slice(0, 12) || "Unknown"}</p>
                </div>
            </div>

            {/* Player Controls */}
            <div className="flex flex-col items-center gap-1 m-auto">
                <div className="flex gap-4">
                    <img className="w-4 cursor-pointer" src={assets.shuffle_icon} alt="Shuffle" />
                    <img onClick={previous} className="w-4 cursor-pointer" src={assets.prev_icon} alt="Previous" />
                    {!playStatus ? (
                        <img onClick={play} className="w-4 cursor-pointer" src={assets.play_icon} alt="Play" />
                    ) : (
                        <img onClick={pause} className="w-4 cursor-pointer" src={assets.pause_icon} alt="Pause" />
                    )}
                    <img onClick={next} className="w-4 cursor-pointer" src={assets.next_icon} alt="Next" />
                    <img className="w-4 cursor-pointer" src={assets.loop_icon} alt="Loop" />
                </div>

                {/* Seek Bar */}
                <div className="flex items-center gap-5">
                    <p className="text-sm text-gray-400">
                        {String(time.currentTime.minute).padStart(2, '0')}:
                        {String(time.currentTime.second).padStart(2, '0')}
                    </p>
                    <div
                        ref={seekBg}
                        className="w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer"
                        onClick={handleSeek}
                    >
                        <div
                            ref={seekBar}
                            className="h-1 border-none w-0 bg-green-800 rounded-full"
                            style={{
                                width: `${
                                    (time.currentTime.second + time.currentTime.minute * 60) /
                                    (time.totalTime.second + time.totalTime.minute * 60) * 100
                                }%`,
                            }}
                        />
                    </div>
                    <p className="text-sm text-gray-400">
                        {String(time.totalTime.minute).padStart(2, '0')}:
                        {String(time.totalTime.second).padStart(2, '0')}
                    </p>
                </div>
            </div>

            {/* Additional Controls */}
            <div className="hidden lg:flex items-center gap-2 opacity-75">
                <img className="w-4 cursor-pointer" src={assets.plays_icon} alt="Plays" />
                <img className="w-4 cursor-pointer" src={assets.mic_icon} alt="Mic" />
                <img className="w-4 cursor-pointer" src={assets.queue_icon} alt="Queue" />
                <img className="w-4 cursor-pointer" src={assets.speaker_icon} alt="Speaker" />
                <img className="w-4 cursor-pointer" src={assets.volume_icon} alt="Volume" />
                <div className="w-20 bg-slate-50 h-1 rounded"></div>
                <img className="w-4 cursor-pointer" src={assets.mini_player_icon} alt="Mini Player" />
                <img className="w-4 cursor-pointer" src={assets.zoom_icon} alt="Zoom" />
            </div>
        </div>
    ) : null
};

export default Player;