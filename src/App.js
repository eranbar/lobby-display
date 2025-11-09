import React, { useEffect, useState } from "react";
import axios from "axios";
import { Building2 } from "lucide-react";


const WEATHER_API_KEY = "9e49ced90a630f4dcffde933bd2872b5";
const CITY = "Nahariya";
const YOUTUBE_VIDEO_ID = "dQw4w9WgXcQ";
const MESSAGES_URL = "https://raw.githubusercontent.com/YOUR_USERNAME/lobby-messages/main/messages.json";

function App() {
  const [weather, setWeather] = useState(null);
  const [messages, setMessages] = useState(["עופרי אני אוהב אותך", "נא לשמור על הניקיון!!!", "נא לא להחנות בחניית נכים", "jksdkjhjkshdsd", ",m,mzxnc,mzxchuyaiyuieryiuryruewryiureyui", "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"]);

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
        console.error("Message fetch failed", err);
      }
    };

    fetchWeather();
    fetchMessages();

    // Auto-refresh every 30 minutes
    const interval = setInterval(() => window.location.reload(), 1000 * 60 * 30);
    return () => clearInterval(interval);
  }, []);

  // App.js (only the render part shown; keep your existing fetch/useEffect logic)
  return (
    <div className="app-root">
      <header className="topbar">
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

      <main className="stage">
        <iframe
          className="youtube-player"
          src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&mute=0&loop=1&playlist=${YOUTUBE_VIDEO_ID}`}
          title="YouTube player"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />

        {/* Message ticker overlay */}
        <div className="ticker-wrap" aria-hidden="true">
          <div
            className="ticker-track"
            style={{ "--ticker-speed": "36s" }} // adjust speed here (CSS var)
          >
            {/* duplicate messages to ensure seamless loop */}
            {[...messages, ...messages].map((msg, idx) => (
              <div key={idx} className="ticker-item">
                {msg}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );


}

export default App;
