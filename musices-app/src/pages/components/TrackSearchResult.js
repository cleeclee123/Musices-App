import React from "react";
import './TrackSearchResult.css'

export default function TrackSearchResult({ track, chooseTrack }) {
    function handlePlay() {
        chooseTrack(track)
    }

    return (
        <div className = 'dash-result-wrapper' onClick = {handlePlay}> 
            <div className = 'dash-result-image-main'> <img className = 'dash-result-image' src = {track.albumUrl} /> </div>

            <div className = 'dash-result-info'>
                <div className = 'dash-result-title'> {track.title}  </div>
                <div className = 'dash-result-artist'> <i> {track.artist} </i> </div>
            </div>
        </div>
  )
}