import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import YouTube from "react-youtube";
import "../App.css";
import "../index.css";

const YOUTUBE_VIDEO_ID = "jsYjqmpzoxo";
const CHANNEL_ID = "UC_x5XG1OV2P6uZZ5FSM9Ttw"; // example: Google Developers
const VIDEOS_URL = "https://raw.githubusercontent.com/YOUR_USERNAME/lobby-messages/main/videos.json";

const YoutubeManager = ({ refreshTick }) => {
/*     const [videos, setVideos] = useState([
        "9Vti9E-TASg",
        "9hFu79HXJGA",
        "gCYcHz2k5x0",
        "jLivRY6pbJE",
        "UScyjLs_XNU",
        "2UCBbcBT5Es",
        "KSgKKSny0Qo",
        "_nvCGQakwD0",
        "WHHmiWUqIZA",
        "XJktaXYRWBg",
        "a4fv-BtzNmY",
        "sBJT1BpOcvg",
        "InAV384eYfU",
        "5-EuMi9-nSw",
        "qAIy8godTy4",
        "Bdc47GCgdzQ",
        "yFgdfG7z5Ho",
        "sHqTmgpBzBQ",
        "_QY_QblgBn0",
        "OWvj21xs-u0",
        "zeHTVxkycgE",
        "1d__3j-bcwM",
        "JA86AFp0gbI",
        "niKlBPLht-4",
        "lsduGj42ZJA",
        "-_D1TMxDbDE",
        "avt-RhUxcmk",
        "Lo0ELoepTCM",
        "_ovdm2yX4MA",
        "JE3QM_9sljI",
        "39Gc2H4lF1A",
        "H8qrbwfhtn4",
        "kpbU7kPGS4k",
        "8Lhdn1paMgY",
        "ZIIT9hO1EZE",
        "z_7F9q7EIoI",
        "KnJvdDxQrZ0",
        "ceH9Ve5J37k",
        "QJPhjOeJkNQ",
        "_9SgawMKmdo",
        "y0ZIcsuJwx4",
        "Rp86eVxDNgc",
        "gU2Jzsa9Q_Y",
        "ve9mgnCUurA",
        "sTmgaP2gYsk",
        "loeRzRrMwLM",
        "VmcRrr4TX74",
        "y_FkQ2jHd1c",
        "stqBS3m-3WE",
        "9vMh9f41pqE"]); // default fallback */
    const [videos, setVideos] = useState([]); // default fallback
    const initRef = useRef(false);

    const [currentVideo, setCurrentVideo] = useState(""/* "9Vti9E-TASg" */);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const mongoPlaylists = await axios.get("https://lobby-display-sh6g.onrender.com:4000/playlists");
                // in case no data in mongo db will retrieve it using youtube api.
                const res = mongoPlaylists?? await axios.get(
                    `https://www.googleapis.com/youtube/v3/search?key=${process.env.REACT_APP_YOUTUBE_DEV_API_KEY}&part=id&type=video&q=electronic music&maxResults=50`
                );
                //console.log("API response items:", res.data.items);
                //const videoIds = res.data.videos.map(i => i).filter(Boolean);
                //console.log("Extracted video IDs:", videoIds);
                setVideos(res.data[0].videos);
            } catch (err) {
                console.error("Videos fetch failed", err);
            }
        };

        // global initialization, should happen only once
        // if (!initRef.current) {
        //     initRef.current = true;
            fetchVideos();
        //}

    }, [refreshTick]);


    useEffect(() => {
        const random = Math.floor(Math.random() * videos.length);
        console.log("Setting currentVideo to:", videos[random]);
        setCurrentVideo(videos[random]);
    }, [videos]);

    // 🔹 Handle video ended event (optional future enhancement)
    const handleVideoEnd = () => {
        const random = videos[Math.floor(Math.random() * videos.length)];
        setCurrentVideo(random);
    };

    return (
        <YouTube
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
            onEnd={handleVideoEnd}
        />

    );
}

export default YoutubeManager;