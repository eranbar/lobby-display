import React, { useEffect, useState } from "react";
import axios from "axios";

const WEATHER_API_KEY = "9e49ced90a630f4dcffde933bd2872b5";
const CITY = "Nahariya";
const YOUTUBE_VIDEO_ID = "dQw4w9WgXcQ";
const MESSAGES_URL = "https://raw.githubusercontent.com/YOUR_USERNAME/lobby-messages/main/messages.json";

function App() {
  const [weather, setWeather] = useState(null);
  const [messages, setMessages] = useState(["נא לשמור על הניקיון!!!", "נא לא להחנות בחניית נכים"]);

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
    <div className="app-container">
    <header className="header">
      <h1>🏢 Lobby Display</h1>
      <div className="weather">
        🌤 {weather?.name} {weather?.sys.country} — {weather?.main.temp}°C, {weather?.weather[0]?.description}, feels like {weather?.main?.feels_like}°C
      </div>
    </header>
  
    <main className="main-content">
      <iframe
        className="youtube-player"
        src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&mute=0&loop=1&playlist=${YOUTUBE_VIDEO_ID}`}
        title="YouTube player"
        allow="autoplay; encrypted-media"
        allowFullScreen
      ></iframe>
  
      <div className="messages-overlay">
        {messages.length > 0 ? 
        messages.map((msg, i) => {
          const top = 10 + (i * 15) % 80; // example top between 10% and 90%
          const style = {
            top: `${top}%`,
            animationDelay: `${i * 3}s`,
          };
          return (
            <div key={i} className="message-flyin" style={style}>
              {msg}
            </div>
          );
        }) : (
          <p className="no-messages">No messages right now.</p>
        )}
      </div>
    </main>
  
    <footer className="footer">Auto-refreshes every 30 minutes</footer>
  </div>
  
  );
}

export default App;
