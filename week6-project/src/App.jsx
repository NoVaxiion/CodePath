import { useState, useEffect } from "react";
import "./App.css";

const BASE_URL = "https://api.open-meteo.com/v1/forecast";
const LOCATION = { latitude: 41.0534, longitude: -73.5387 }; // Stamford, CT

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchHourly = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          latitude: LOCATION.latitude,
          longitude: LOCATION.longitude,
          hourly:
            "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m",
          forecast_days: "2",
          timezone: "auto",
          temperature_unit: "fahrenheit",
          windspeed_unit: "mph",
          precipitation_unit: "inch",
        });

        const res = await fetch(`${BASE_URL}?${params}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const h = json.hourly;
        if (!h || !Array.isArray(h.time))
          throw new Error("Unexpected response format");

        const merged = h.time.map((t, i) => ({
          time: t,
          temp: h.temperature_2m[i],
          humidity: h.relative_humidity_2m[i],
          precip: h.precipitation[i],
          wind: h.wind_speed_10m[i],
        }));
        setItems(merged);
      } catch (err) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchHourly();
  }, []);

  if (loading) return <div className="note">Loading data…</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const visible = items.filter((h) => {
    const matchSearch =
      !search ||
      h.time.toLowerCase().includes(search.toLowerCase()) ||
      (search.toLowerCase().includes("rain") && h.precip > 0);
    let matchFilter = true;
    if (filter === "Dry") matchFilter = h.precip === 0;
    else if (filter === "Rainy") matchFilter = h.precip > 0;
    else if (filter === "Windy") matchFilter = h.wind > 15;
    return matchSearch && matchFilter;
  });

  const avgTemp =
    visible.reduce((sum, h) => sum + h.temp, 0) / (visible.length || 1);
  const maxWind = Math.max(...visible.map((h) => h.wind), 0);
  const rainPct = (
    (visible.filter((h) => h.precip > 0).length / (visible.length || 1)) *
    100
  ).toFixed(0);

  return (
    <div className="page">
      <h1>Stamford Hourly Weather (48 h)</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="Search time (e.g. 12:00)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          <option>Dry</option>
          <option>Rainy</option>
          <option>Windy</option>
        </select>
      </div>

      <div className="stats">
        <div>Hours: {visible.length}</div>
        <div>Avg Temp: {avgTemp.toFixed(1)} °F</div>
        <div>Max Wind: {maxWind.toFixed(1)} mph</div>
        <div>Rain Hours: {rainPct}%</div>
      </div>

      <div className="table">
        <div className="row header">
          <div>Time</div>
          <div>Temp (°F)</div>
          <div>Humidity (%)</div>
          <div>Wind (mph)</div>
          <div>Precip (in)</div>
        </div>
        {visible.map((h) => (
          <div key={h.time} className="row">
            <div>{h.time.replace("T", " ")}</div>
            <div>{h.temp.toFixed(1)}</div>
            <div>{h.humidity}</div>
            <div>{h.wind}</div>
            <div>{h.precip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
