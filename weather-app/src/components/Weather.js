import React, { useState, useEffect } from "react";

export default function Weather() {
  const apiKey = "1c436a4ae63a0ad73059a91b4f43a82a";

  const [city, setCity] = useState("Patna");
  const [search, setSearch] = useState("");
  const [current, setCurrent] = useState(null);
  const [hourly, setHourly] = useState([]);
  const [weekly, setWeekly] = useState([]);

  const fetchWeather = async (cityName) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`
      );
      if (!res.ok) throw new Error();
      const data = await res.json();

      setCity(`${data.city.name}, ${data.city.country}`);

      setCurrent({
        temp: Math.round(data.list[0].main.temp),
        desc: data.list[0].weather[0].description,
        icon: data.list[0].weather[0].icon
      });

      setHourly(data.list.slice(1, 6));

      const days = {};
      for (let i = 0; i < data.list.length; i++) {
        const d = new Date(data.list[i].dt * 1000).toDateString();
        if (!days[d] && Object.keys(days).length < 4) {
          days[d] = data.list[i];
        }
      }
      setWeekly(Object.values(days));
    } catch (error) {
      alert("City not found");
    }
  };

  useEffect(() => {
    fetchWeather("Patna");
  }, []);

  return (
    <div className="weather-container">

      <div className="header">
        <h1>☁️ WEATHER APP</h1>

        <div className="search">
          <input
            type="text"
            placeholder="Enter city name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => fetchWeather(search || "Patna")}>Search</button>
        </div>
      </div>

      <div className="box">
        {current && (
          <div className="center">
            <h2>{city}</h2>
            <img
              src={`https://openweathermap.org/img/wn/${current.icon}@2x.png`}
              alt=""
            />
            <p className="temp">{current.temp} °C</p>
            <p>{current.desc}</p>
          </div>
        )}

        <div className="hourly">
          <p className="title">Hourly Forecast</p>

          <div className="grid">
            {hourly.map((item, index) => (
              <div className="card" key={index}>
                <p>
                  {new Date(item.dt * 1000).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
                <p>
                  {Math.round(item.main.temp_max)} °C /{" "}
                  {Math.round(item.main.temp_min)} °C
                </p>
                <p>{item.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="box">
        <p className="title">4-Day Forecast</p>
        <div className="grid">
          {weekly.map((item, index) => (
            <div className="week-card" key={index}>
              <p>{new Date(item.dt * 1000).toDateString()}</p>
              <p>
                {Math.round(item.main.temp_max)} °C /{" "}
                {Math.round(item.main.temp_min)} °C
              </p>
              <p>{item.weather[0].description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
