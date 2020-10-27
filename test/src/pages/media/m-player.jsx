import React from 'react';
import Player from 'react-player';
// import Player from 'react-player/youtube';

const config = {
    // source: "//player.alicdn.com/video/aliyunmedia.mp4",
    youtube: {
        playerVars: { showinfo: 1 }
    },
    facebook: {
        appId: '12345'
    }
    // components: [
    //     {
    //         name: "RateComponent",
    //         type: Player.components.RateComponent,
    //     }
    // ]
};
export default class extends React.Component {

    state = {
        instance: null,  // player instance, e.g: player.stop();
    }
    render() {
        return <div>
            <Player 
                // url='http://player.alicdn.com/video/aliyunmedia.mp4' 
                url='http://localhost:8088/live/test.flv?sign=1629689121-a74dd2834e84772d59031a59c393ae85' 
                playing={true}
                width='100%'
                height='100%'
                config={config} />
        </div>
    }
}