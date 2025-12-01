import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Building2 } from "lucide-react";
import YouTube from "react-youtube";
import SignInButton from "./SignInButton";  // adjust path accordingly

const WEATHER_API_KEY = "9e49ced90a630f4dcffde933bd2872b5";
const CITY = "Nahariya";
const YOUTUBE_VIDEO_ID = "jsYjqmpzoxo";
const YOUTUBE_API_KEY = "AIzaSyC9xkESuli1xSkyVNepQ_08gxcbpBxLER8";
const CHANNEL_ID = "UC_x5XG1OV2P6uZZ5FSM9Ttw"; // example: Google Developers
const MESSAGES_URL = "https://raw.githubusercontent.com/YOUR_USERNAME/lobby-messages/main/messages.json";
const VIDEOS_URL = "https://raw.githubusercontent.com/YOUR_USERNAME/lobby-messages/main/videos.json";

function App() {
  const [weather, setWeather] = useState(null);
  const [messages, setMessages] = useState([
    "עופרי אני אוהב אותך",
    "נא לשמור על הניקיון!!!",
    "נא לא להחנות בחניית נכים",
    "jksdkjhjkshdsd",
    ",m,mzxnc,mzxchuyaiyuieryiuryruewryiureyui",
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"]);

  const [videos, setVideos] = useState([]); // default fallback
  const [currentVideo, setCurrentVideo] = useState('9Vti9E-TASg');
  const initRef = useRef(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${WEATHER_API_KEY}&units=metric&lang=en`
        );
        setWeather(res.data);
      } catch (err) {
        console.error("Weather fetch failed", err);
      }
    };

    const fetchMessages = async () => {
      try {
        const res = await axios.get(MESSAGES_URL);
        setMessages(res.data);
      } catch (err) {
        //console.error("Message fetch failed", err);
      }
    };

    const fetchVideos = async () => {
      try {
        const res = await axios.get(
          `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&part=id&type=video&q=electronic music&maxResults=50`
        );
        console.log("API response items:", res.data.items);
        const videoIds = res.data.items.map(i => i.id.videoId).filter(Boolean);
        console.log("Extracted video IDs:", videoIds);
        setVideos(videoIds);
      } catch (err) {
        console.error("Videos fetch failed", err);
      }
    };

    fetchVideos();
    fetchWeather();
    fetchMessages();

    // Auto-refresh every 30 minutes
    const interval = setInterval(() => window.location.reload(), 1000 * 60 * 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (initRef.current) return;
    if (videos.length > 0) {
      initRef.current = true;
      const random = Math.floor(Math.random() * videos.length);
      console.log("Setting currentVideo to:", videos[random]);
      setCurrentVideo(videos[random]);
    }
  }, [videos]);


  // 🔹 Handle video ended event (optional future enhancement)
  const handleVideoEnd = () => {
    const random = videos[Math.floor(Math.random() * videos.length)];
    setCurrentVideo(random);
  };


  // App.js (only the render part shown; keep your existing fetch/useEffect logic)
  return (
    <div className="app-root">
      <header className="topbar">
        <div style={{ "align-items": "left" }}>
          <SignInButton />
        </div>
        <h1 className="title">
          <Building2 className="icon" /> יחידה 101 בניין 12
        </h1>
        <div className="weather">
          {weather ? (
            <>
              <div className="weather-city">🌤 {weather.name} {weather.sys?.country}</div>
              <div className="weather-temp">{Math.round(weather.main.temp)}°C</div>
              <div className="weather-desc">{weather.weather[0]?.description} · feels like {Math.round(weather.main.feels_like)}°C</div>
            </>
          ) : (
            <div className="weather-loading">Loading weather...</div>
          )}
        </div>
      </header>
      <div className="video-container">
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
              mute: 1
            }
          }}
          onEnd={handleVideoEnd}
        />
      </div>

      <div className="ticker-wrap" aria-hidden="true">
        <div className="ticker-track" style={{ "--ticker-speed": "36s" }}>
          {[...messages, ...messages].map((msg, idx) => (
            <div key={idx} className="ticker-item">{msg}</div>
          ))}
        </div>
      </div>

    </div >
  );


}

export default App;
