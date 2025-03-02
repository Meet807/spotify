/* eslint-disable no-unused-vars */
import Display from "./components/Display";
import Player from "./components/Player";
import Scrollbar from "./components/Scrollbar";
import { ToastContainer } from "react-toastify";
import { PlayerContext } from "./context/PlayerContext";
import React, { useContext } from "react";

const App = () => {
  const { audioRef, track, songsData } = useContext(PlayerContext);

  return (
    <div className="flex flex-col min-h-screen w-screen bg-black">
      <ToastContainer />

      {/* Main content area taking up full screen */}
      {songsData.length !== 0 && (
        <div className="flex flex-col flex-grow w-full h-full">
          <div className="flex flex-grow w-full h-full">
            <Scrollbar className="w-1/4" />
            <Display className="flex-grow" />
          </div>

          {/* Player fixed at the bottom, full width */}
          <Player className="h-24 w-full bg-gray-800 fixed bottom-0 left-0" />
        </div>
      )}

      {/* Audio element */}
      <audio ref={audioRef} src={track?.file ?? ""} preload="auto"></audio>
    </div>
  );
};

export default App;
