import React from 'react';
import ReactPlayer from 'react-player';
import './../css/videoPlayer.css';
export default function VideoPlayer() {
  return (
    <>
    <div className='player-wrapper'>
        <ReactPlayer
          className='react-player'
          url='https://www.youtube.com/watch?v=ysz5S6PUM-U'
          width='98%'
          height='95%'
          controls={true}
        />
      </div>
    </>
  )
}
