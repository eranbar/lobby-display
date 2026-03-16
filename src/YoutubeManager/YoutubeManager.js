import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import YouTube from "react-youtube";
import "../App.css";
import "../index.css";

//const YOUTUBE_VIDEO_ID = "jsYjqmpzoxo";
//const CHANNEL_ID = "UC_x5XG1OV2P6uZZ5FSM9Ttw"; // example: Google Developers
//const VIDEOS_URL = "https://raw.githubusercontent.com/YOUR_USERNAME/lobby-messages/main/videos.json";

const YoutubeManager = ({ refreshTick }) => {
    const [videos, setVideos] = useState([]); // default fallback
    const [currentVideo, setCurrentVideo] = useState(""/* "9Vti9E-TASg" */);
    const playerRef = useRef(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const mongoPlaylists = await axios.get(
                    "https://lobby-display-sh6g.onrender.com/playlists"
                );

                let newVideos = [];

                if (mongoPlaylists.data.length > 0) {
                    newVideos = mongoPlaylists.data[0].videos;
                } else {
                    const res = await axios.get(
                        `https://www.googleapis.com/youtube/v3/search?key=${process.env.REACT_APP_YOUTUBE_DEV_API_KEY}&part=id&type=video&q=deep house&maxResults=50`
                    );

                    newVideos = res.data.items.map(v => v.id.videoId);
                }

                // 🔹 Compare with previous state safely
                setVideos(prev => {
                    if (
                        prev.length === newVideos.length &&
                        prev.every((v, i) => v === newVideos[i])
                    ) {
                        return prev;
                    }

                    console.log("Playlist updated");

                    return newVideos;
                });

            } catch (err) {
                console.error("Videos fetch failed", err);
            }
        };

        fetchVideos();

    }, [refreshTick]);


    const playNextVideo = useCallback(() => {
        const random = videos[Math.floor(Math.random() * videos.length)];
        console.log("Setting currentVideo to:", random);
        setCurrentVideo(random);
    }, [videos]);

    useEffect(() => {
        if (videos.length === 0) return;
        playNextVideo();
    }, [videos, playNextVideo]);

    // 🔹 Handle video ended event (optional future enhancement)
    // const handleVideoEnd = () => {
    //     const random = videos[Math.floor(Math.random() * videos.length)];
    //     setCurrentVideo(random);
    // };

    const handlePlayerReady = (event) => {
        playerRef.current = event.target;
        event.target.unMute(); // optional, unmute after autoplay starts
    };

    const onPlayerError = (event) => {

    }

    /*     const playNextVideo = () => {
    
            if (!playerRef.current || videos.length === 0) return;
    
            let random;
    
            do {
                random = videos[Math.floor(Math.random() * videos.length)];
            } while (random === currentVideo && videos.length > 1);
    
            setCurrentVideo(random);
            playerRef.current.loadVideoById(random);
        }; */

    const handlePlayerStateChange = (event) => {
        // 0 = video ended
        if (event.data === 0) {
            playNextVideo();
        }
    };

    return (
        <YouTube
            key={currentVideo}
            videoId={currentVideo}
            className="youtube-player"
            opts={{
                height: "100%",
                width: "100%",
                playerVars: {
                    autoplay: 1,
                    controls: 0,
                    rel: 0,
                    modestbranding: 1,
                    mute: 0
                }
            }}
            onStateChange={handlePlayerStateChange}
            onReady={handlePlayerReady}
            onError={onPlayerError}
        />

    );
}

export default YoutubeManager;