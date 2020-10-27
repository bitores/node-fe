import React from 'react';
import Player from 'aliplayer-react';

const config = {
    // source: "//player.alicdn.com/video/aliyunmedia.mp4",
    // source: "http://localhost:8088/live/test.flv?sign=1629689121-a74dd2834e84772d59031a59c393ae85",
    source: "http://localhost:1030/live/test.flv?sign=1629689121-a74dd2834e84772d59031a59c393ae85",
    width: "100%",
    height: "500px",
    autoplay: true,
    isLive: false,
    rePlay: false,
    playsinline: true,
    preload: true,
    controlBarVisibility: "hover",
    useH5Prism: true,
    components: [
        {
            name: "RateComponent",
            type: Player.components.RateComponent,
        }
    ]
};
export default class extends React.Component {

    state = {
        instance: null,  // player instance, e.g: player.stop();
    }
    render() {
        return <div>
            <Player
                config={config}
                onGetInstance={instance => this.setState({ instance })}
            />
        </div>
    }
}