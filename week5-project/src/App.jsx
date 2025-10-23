import { useState } from "react";
import "./App.css";

const API_KEY = import.meta.env.VITE_CAT_API_KEY;

export default function App() {
  const [cat, setCat] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Ban object by attribute
  const [ban, setBan] = useState({
    name: [],
    weight: [],
    origin: [],
    life_span: [],
  });

  // Build endpoint
  const url = new URL("https://api.thecatapi.com/v1/images/search");
  url.searchParams.set("has_breeds", "1");
  url.searchParams.set("limit", "1");

  // Helpers: ban add/remove/check
  const addBan = (attr, value) => {
    if (!value) return;
    setBan((prev) => {
      const list = prev[attr] || [];
      if (list.includes(value)) return prev;
      return { ...prev, [attr]: [...list, value] };
    });
  };

  const removeBan = (attr, value) => {
    setBan((prev) => ({
      ...prev,
      [attr]: (prev[attr] || []).filter((v) => v !== value),
    }));
  };

  const isBanned = (candidate) => {
    return (
      ban.name?.includes(candidate.name) ||
      ban.weight?.includes(candidate.weight) ||
      ban.origin?.includes(candidate.origin) ||
      ban.life_span?.includes(candidate.life_span)
    );
  };

  // Fetch with retries, skipping banned attributes
  const fetchRandomCat = async () => {
    setLoading(true);
    setError("");

    try {
      const maxAttempts = 10;
      let attempt = 0;
      let picked = null;

      while (attempt < maxAttempts) {
        const res = await fetch(url, {
          headers: { "x-api-key": API_KEY || "" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json(); // [ { url, breeds: [ {...} ] } ]
        const item = data?.[0];
        const breed = item?.breeds?.[0];

        if (!item || !breed) {
          attempt++;
          continue;
        }

        const candidate = {
          url: item.url,
          id: item.id,
          name: breed.name,
          origin: breed.origin,
          temperament: breed.temperament,
          description: breed.description,
          life_span: breed.life_span,
          weight: `${breed.weight?.imperial ?? ""} lbs`,
          short_legs: Boolean(breed.short_legs),
          indoor: Boolean(breed.indoor),
        };

        if (!isBanned(candidate)) {
          picked = candidate;
          break;
        }
        attempt++;
      }

      if (!picked)
        throw new Error(
          "No results matched due to your ban list. Remove one and try again."
        );
      setCat(picked);
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <header className="page__header">
        <h1 className="title">Adorable Cats</h1>
        <button
          className="btn btn--primary"
          onClick={fetchRandomCat}
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "Loading..." : "Discover"}
        </button>
      </header>

      {error && <p className="alert alert--error">{error}</p>}

      {cat && (
        <article className="card">
          <div className="card__media">
            <img src={cat.url} alt={cat.name} className="card__img" />
          </div>

          <div className="card__body">
            <h2 className="card__title">{cat.name}</h2>

            {/* Attribute chips (click to ban) */}
            <div className="chips" style={{ margin: "8px 0 12px" }}>
              <button
                type="button"
                className="chip"
                onClick={() => addBan("name", cat.name)}
              >
                {cat.name}
              </button>
              {cat.weight && (
                <button
                  type="button"
                  className="chip"
                  onClick={() => addBan("weight", cat.weight)}
                >
                  {cat.weight}
                </button>
              )}
              <button
                type="button"
                className="chip"
                onClick={() => addBan("origin", cat.origin)}
              >
                {cat.origin}
              </button>
              <button
                type="button"
                className="chip"
                onClick={() => addBan("life_span", cat.life_span)}
              >
                {cat.life_span} years
              </button>
            </div>

            <p className="meta">
              <span className="meta__label">Temperament:</span>
              <span>{cat.temperament}</span>
            </p>
          </div>
        </article>
      )}

      {/* Ban list grouped by attribute */}
      <section className="ban">
        <h3 className="ban__title">Ban list</h3>

        {["name", "weight", "origin", "life_span"].map((attr) => (
          <div key={attr} className="ban__group" style={{ marginTop: 10 }}>
            <div
              className="ban__groupTitle"
              style={{ color: "#8a8f98", fontWeight: 600, marginBottom: 6 }}
            >
              {attr.replace("_", " ").toUpperCase()}
            </div>

            {(ban[attr] || []).length ? (
              <div className="chips">
                {ban[attr].map((val) => (
                  <button
                    key={`${attr}:${val}`}
                    type="button"
                    className="chip"
                    onClick={() => removeBan(attr, val)}
                    title="Remove from ban list"
                  >
                    {attr === "life_span" ? `${val} years` : val}
                    <span className="chip__x">×</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="ban__empty">None</p>
            )}
          </div>
        ))}

        <p className="ban__hint">
          Banned attributes are skipped when discovering new cats.
        </p>
      </section>
    </main>
  );
}
