import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
const WEATHER_API_KEY = "9e49ced90a630f4dcffde933bd2872b5";
const CITY = "Nahariya";

const Weather = ({refreshTick}) => {
    const [weather, setWeather] = useState(null);

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

        fetchWeather();
    }, [refreshTick]);

    return (
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
    );
}

export default Weather;