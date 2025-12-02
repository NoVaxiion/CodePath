import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

const BASE_URL = "https://api.open-meteo.com/v1/forecast";
const LOCATION = { latitude: 41.0534, longitude: -73.5387 }; // Stamford, CT

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fallbackUsed, setFallbackUsed] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // debug logging for mount / data
  useEffect(() => {
    console.log("[Dashboard] state", {
      loading,
      error,
      itemsLength: items.length,
    });
  }, [loading, error, items.length]);

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

        // cache for detail pages
        localStorage.setItem("weatherData", JSON.stringify(merged));
      } catch (err) {
        // If the network or API fails, fall back to generated sample data so the UI remains usable.
        console.error("[Dashboard] fetch error:", err);
        setError(err.message || String(err));
        const sample = createSampleData();
        setItems(sample);
        setFallbackUsed(true);
      } finally {
        setLoading(false);
      }
    };
    fetchHourly();
  }, []);

  // Generate simple sample data (48 hours) to use when API is unavailable.
  function createSampleData(hours = 48) {
    const now = new Date();
    const arr = [];
    for (let i = 0; i < hours; i++) {
      const d = new Date(now.getTime() + i * 60 * 60 * 1000);
      const iso = d.toISOString().slice(0, 19);
      const temp =
        40 +
        Math.round(15 * Math.sin((i / 24) * Math.PI * 2) + Math.random() * 6);
      const humidity = 40 + Math.round(Math.random() * 40);
      const wind = Math.round(Math.random() * 20 * 10) / 10;
      const precip =
        Math.random() < 0.2 ? Math.round(Math.random() * 100) / 100 : 0;
      arr.push({ time: iso.replace(" ", "T"), temp, humidity, precip, wind });
    }
    return arr;
  }

  // Calculate all derived data and memoized values BEFORE any early returns
  const visible = useMemo(() => {
    return items.filter((h) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        h.time.toLowerCase().includes(q) ||
        (q.includes("rain") && h.precip > 0);
      let matchFilter = true;
      if (filter === "Dry") matchFilter = h.precip === 0;
      else if (filter === "Rainy") matchFilter = h.precip > 0;
      else if (filter === "Windy") matchFilter = h.wind > 15;
      return matchSearch && matchFilter;
    });
  }, [items, search, filter]);

  const avgTemp =
    visible.reduce((sum, h) => sum + h.temp, 0) / (visible.length || 1);
  const maxWind = Math.max(...visible.map((h) => h.wind), 0);
  const rainPct = (
    (visible.filter((h) => h.precip > 0).length / (visible.length || 1)) *
    100
  ).toFixed(0);

  // Data for charts
  const chartData = useMemo(
    () =>
      visible.map((h) => ({
        ...h,
        // smaller label for tooltip/x-axis if you choose to show it
        label: h.time.replace("T", " "),
      })),
    [visible]
  );

  if (loading) return <div className="note">Loading data…</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="page">
      {fallbackUsed && (
        <div
          style={{
            marginBottom: "0.75rem",
            padding: "0.5rem",
            borderRadius: 6,
            background: "#fff4e5",
            color: "#663c00",
          }}
        >
          <strong>Offline mode:</strong> using generated sample data because the
          weather API failed or is unreachable.
        </div>
      )}

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

      {/* --- Charts (two unique charts on the dashboard) --- */}
      <div className="charts">
        <div className="chartCard">
          <h3>Temperature vs Time</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" hide />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="temp" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chartCard">
          <h3>Wind Speed vs Time</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" hide />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="wind" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- Table list with dynamic links to detail route --- */}
      <div className="table">
        <div className="row header">
          <div>Time</div>
          <div>Temp (°F)</div>
          <div>Humidity (%)</div>
          <div>Wind (mph)</div>
          <div>Precip (in)</div>
        </div>
        {visible.map((h) => (
          <Link
            key={h.time}
            to={`/hour/${encodeURIComponent(h.time)}`}
            className="row"
            title="Open detail view"
            style={{ color: "inherit" }}
          >
            <div>{h.time.replace("T", " ")}</div>
            <div>{h.temp.toFixed(1)}</div>
            <div>{h.humidity}</div>
            <div>{h.wind}</div>
            <div>{h.precip}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
