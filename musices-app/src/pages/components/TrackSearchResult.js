import React from "react";
import './TrackSearchResult.css';

export default function TrackSearchResult({ track }) {
    return (
        <div className = "track-search-results-main">
            <img src = {track.albumUrl} />
        </div>
    )
}