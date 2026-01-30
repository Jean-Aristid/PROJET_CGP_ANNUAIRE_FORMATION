import { useEffect, useState } from "react";
import "./app.css";

export default function App() {
  const [health, setHealth] = useState(null);
  const [dbTime, setDbTime] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/health").then((r) => r.json()),
      fetch("/api/db-time").then((r) => r.json()),
    ])
      .then(([healthRes, dbRes]) => {
        setHealth(healthRes);
        setDbTime(dbRes);
      })
      .catch((e) => setError(e?.message ?? String(e)));
  }, []);

  return (
    <main className="container">
      <h1>Annuaire Formation</h1>

      {error && <p className="error">Erreur : {error}</p>}

      <section>
        <h2>API</h2>
        <pre>{health ? JSON.stringify(health, null, 2) : "Chargement..."}</pre>
      </section>

      <section>
        <h2>Base de données</h2>
        <pre>{dbTime ? JSON.stringify(dbTime, null, 2) : "Chargement..."}</pre>
      </section>
    </main>
  );
}

