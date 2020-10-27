import React from 'react';
import {Button, Input} from 'antd';
import './player.less';


class RCNodePlayer extends React.Component {

    componentDidMount() {
        const { id, url, width, height, keepScreenOn, scaleMode, bufferTime, volume, autoplay, onRef } = this.props;
        const canvas = document.getElementById(id)
        if (width) {
            canvas.width = width
        }
        if (height) {
            canvas.height = height
        }
        if (onRef) {
            onRef(this)
        }


        // var url2 = document.getElementById("url");
        var button = document.getElementById("play");
        var logview = document.getElementById("log");
        var audioCB = document.getElementById("audioCB");
        var videoCB = document.getElementById("videoCB");
        Module.print = (text) => {
            logview.innerHTML = logview.innerHTML + text + "\n";
        };

        Module.printErr = (text) => {
            logview.innerHTML = logview.innerHTML + text + "\n";
        }

        // window.Module.NodePlayer.load(() => {
        const np = new window.Module.NodePlayer();
        this.player = np;
        var isStarting = false;
        np.on('start', () => {
            Module.print('NodePlayer on start');
        })
        np.on('close', () => {
            Module.print('NodePlayer on close');
        });
        np.on('error', (err) => {
            Module.print('NodePlayer on error',err);
        });
        np.setPlayView(id);
        np.setScaleMode(1);
        // np.enableVideo(videoCB.checked);
        // np.enableAudio(audioCB.checked);
        var playback = function (event) {
            if (isStarting) {
                np.stop();
                button.value = "start";
                isStarting = false;
            } else {
                np.start(url.value);
                button.value = "stop";
                isStarting = true;
            }
        }

        var audioChange = function () {
        np.enableAudio(audioCB.checked);
        }

        var videoChange = function () {
        np.enableVideo(videoCB.checked);
        }

        // if (button.addEventListener) {
        // button.addEventListener("click", playback, false);
        // } else if (button.attachEvent) {
        // button.attachEvent('onclick', playback);
        // }

        // if (videoCB.addEventListener) {
        // videoCB.addEventListener("click", videoChange, false);
        // } else if (button.attachEvent) {
        // videoCB.attachEvent('onclick', videoChange);
        // }

        // if (audioCB.addEventListener) {
        // audioCB.addEventListener("click", audioChange, false);
        // } else if (audioCB.attachEvent) {
        // audioCB.attachEvent('onclick', audioChange);
        // }
        // });
    }

    componentWillUnmount() {
        this.stop();
    }

    setVolume(volume) {
        if (this.player) {
            this.player.setVolume(volume);
        }
    }

    setScaleMode(mode) {
        if (this.player) {
            this.player.setScaleMode(mode);
        }
    }

    start(url) {
        if (this.player) {
            this.player.play(!!url ? url : this.props.url)
        }
    }

    stop() {
        if (this.player) {
            this.player.stop();
        }
    }

    fullscreen() {
        if (this.player) {
            this.player.fullscreen();
        }
    }

    screenshot() {
        if(this.player) {
            // player.screenshot("np_screenshot.png", "png");
            this.player.screenshot("np_screenshot.jpeg", "jpeg", 0.8);
        }
        
    }

    render() {
        const { id, style } = this.props;
        return (<div>
            <canvas id={id} style={style} />
            
            <Input.Group>
                <Input />
                <Button onClick={()=>{
                    if(this.player) {
                        this.player.start(this.props.url);
                    }
                }}>Play</Button> 
                
            </Input.Group>
                {/* <input id="url" value="ws://192.168.0.10/live/stream.flv" /> */}
                {/* <input id="play" type="button" value="Play" />
                <input type="checkbox" id="audioCB" value="enableAudio" />
                <label for="enableAudio">enableAudio</label>
                <input type="checkbox" id="videoCB" value="enableVideo" checked/>
                <label for="enableVideo">enableVideo</label> */}
                <br />
                <textarea id="log" rows="8"></textarea>
        </div>
            
        )
    }
}

export default RCNodePlayer;