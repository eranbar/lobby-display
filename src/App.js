import React, { useEffect, useState } from "react";
import axios from "axios";

const WEATHER_API_KEY = "9e49ced90a630f4dcffde933bd2872b5";
const CITY = "Nahariya";
const YOUTUBE_VIDEO_ID = "dQw4w9WgXcQ";
const MESSAGES_URL = "https://raw.githubusercontent.com/YOUR_USERNAME/lobby-messages/main/messages.json";

function App() {
  const [weather, setWeather] = useState(null);
  const [messages, setMessages] = useState([]);

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

  return (
    <div>
      <h1>🏢 Lobby Display</h1>

      <div className="card">
        <iframe
          src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&mute=0&loop=1&playlist=${YOUTUBE_VIDEO_ID}`}
          title="YouTube player"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      </div>


      <div className="card">
        <h2>🌤 {weather?.name} {weather?.sys.country}</h2>
        <p>
          {weather?.main.temp}°C {weather?.weather[0]?.description}, feels like: {weather?.main?.feels_like}°C
        </p>
      </div>


      <div className="card">
        <h2>📢 Announcements</h2>
        {messages.length > 0 ? (
          <ul>
            {messages.map((msg, i) => (
              <li key={i}>{msg.text}</li>
            ))}
          </ul>
        ) : (
          <p>No messages right now.</p>
        )}
      </div>

      <footer>Auto-refreshes every 30 minutes</footer>
    </div>
  );
}

export default App;
