import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const BASE_URL = "https://api.open-meteo.com/v1/forecast";
const LOCATION = { latitude: 41.0534, longitude: -73.5387 }; // Stamford, CT

export default function Detail() {
  const { time } = useParams(); // ISO string
  const [items, setItems] = useState(null);

  // Load from cache first; if empty, refetch quickly
  useEffect(() => {
    const cached = JSON.parse(localStorage.getItem("weatherData") || "[]");
    if (cached.length) {
      setItems(cached);
      return;
    }
    // fallback fetch if user landed directly on detail route
    (async () => {
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
        const json = await res.json();
        const h = json.hourly;
        const merged = h.time.map((t, i) => ({
          time: t,
          temp: h.temperature_2m[i],
          humidity: h.relative_humidity_2m[i],
          precip: h.precipitation[i],
          wind: h.wind_speed_10m[i],
        }));
        setItems(merged);
        localStorage.setItem("weatherData", JSON.stringify(merged));
      } catch {
        setItems([]);
      }
    })();
  }, []);

  const selected = useMemo(
    () => (items || []).find((h) => h.time === time),
    [items, time]
  );

  // Provide a mini context window (+/- 6 hours) for the chart
  const context = useMemo(() => {
    if (!items || !selected) return [];
    const idx = items.findIndex((h) => h.time === selected.time);
    const start = Math.max(0, idx - 6);
    const end = Math.min(items.length, idx + 7);
    return items.slice(start, end).map((h) => ({
      ...h,
      label: h.time.replace("T", " "),
    }));
  }, [items, selected]);

  if (!items) return <div className="note">Loading…</div>;
  if (!selected) {
    return (
      <div className="page">
        <Link to="/">← Back</Link>
        <h1>Hour not found</h1>
        <p>This time isn’t in the current 48-hour forecast window.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <Link to="/">← Back</Link>
      <h1>Details for {selected.time.replace("T", " ")}</h1>

      {/* Extra details that weren’t emphasized on the dashboard */}
      <div className="stats" style={{ marginTop: ".5rem" }}>
        <div>Temperature: {selected.temp.toFixed(1)} °F</div>
        <div>Humidity: {selected.humidity}%</div>
        <div>Wind: {selected.wind} mph</div>
        <div>Precipitation: {selected.precip} in</div>
      </div>

      <div className="charts">
        <div className="chartCard">
          <h3>Context: Temperature Around Selected Hour</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={context}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" hide />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="temp" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chartCard">
          <h3>Context: Wind Speed Around Selected Hour</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={context}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" hide />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="wind" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
