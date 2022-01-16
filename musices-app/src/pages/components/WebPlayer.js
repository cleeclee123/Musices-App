import { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"

export default function Player({ accessToken, trackUri }) {
    const [play, setPlay] = useState(false)

    useEffect(() => setPlay(true), [trackUri])

    if (!accessToken) return null
    return (
        <SpotifyPlayer
            token = {accessToken}
            showSaveIcon
            callback = {state => {
                if (!state.isPlaying) setPlay(false)
            }}
            play = {play}
            uris = {trackUri ? [trackUri] : []}
            styles = {{
                activeColor: '#FF0000',
                bgColor: '#636568',
                color: '#000000',
                loaderColor: '#007BF5',
                sliderColor: '#3E81F7',
                sliderHandleColor: '#000000',
                trackArtistColor: '#C7C7C7',
                trackNameColor: '#FFFFFF',
            }}
        />
    )
}