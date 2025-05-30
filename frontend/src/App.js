import React, { useState } from "react";
import axios from "axios";

const backendURL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    setError(null);
    setWeather(null);
    try {
      const response = await axios.get(`${backendURL}/weather?city=${city}`);
      setWeather(response.data);
    } catch (err) {
      setError("Failed to fetch weather data");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        background: "#fff",
        padding: 32,
        borderRadius: 16,
        boxShadow: "0 8px 24px rgba(0,0,0,0.09)",
        minWidth: 350
      }}>
        <h1 style={{textAlign:"center", marginBottom: 24}}>Weather App</h1>
        <div style={{display: "flex", gap: 8, marginBottom: 24}}>
          <input
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="Enter city"
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #ccc"
            }}
          />
          <button onClick={fetchWeather}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background: "#185a9d",
              color: "#fff",
              border: "none",
              cursor: "pointer"
            }}>
            Get Weather
          </button>
        </div>
        {error && <div style={{ color: "red", marginBottom: 16 }}>{error}</div>}
        {weather && (
          <div style={{
            background: "#f8faff",
            padding: 16,
            borderRadius: 12,
            textAlign: "center"
          }}>
            <h2 style={{margin: "8px 0"}}>
              {weather.name}, {weather.sys && weather.sys.country}
            </h2>
            <div style={{fontSize: 44, fontWeight: 700, margin: "12px 0"}}>
              {Math.round(weather.main.temp)}°C
            </div>
            <div style={{fontSize: 18, margin: "8px 0"}}>
              {weather.weather && weather.weather[0].description}
            </div>
            {weather.weather && weather.weather[0].icon && (
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="icon"
                width={80}
                height={80}
                style={{margin: "8px 0"}}
              />
            )}
            <div style={{marginTop: 16}}>
              <span>💧 {weather.main.humidity}%</span>
              <span style={{marginLeft: 16}}>💨 {weather.wind.speed} m/s</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
