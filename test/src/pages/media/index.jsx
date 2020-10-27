import React from 'react';
import RCNodePlayer from './node-player';

export default ()=>(<header className="App-header">
    <RCNodePlayer
      id="video_view" 
      width="640" 
      height="480" 
      url="ws://localhost:8088/live/test.flv?sign=1629689121-a74dd2834e84772d59031a59c393ae85"
      scaleMode="0"
      bufferTime="1000"
      autoplay
      />

    <p>
      NodePlayer.js React Demo
    </p>
  </header>)