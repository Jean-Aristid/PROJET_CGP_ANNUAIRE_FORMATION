const express = require("express");
const { Pool } = require("pg");

const port = Number.parseInt(process.env.PORT ?? "3001", 10);

const pool = new Pool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number.parseInt(process.env.DB_PORT ?? "5432", 10),
  user: process.env.DB_USER ?? "annuaire",
  password: process.env.DB_PASSWORD ?? "annuaire",
  database: process.env.DB_NAME ?? "annuaire",
});

const app = express();

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.get("/api/db-time", async (_req, res) => {
  try {
    const result = await pool.query("select now() as now;");
    res.json({ now: result.rows[0]?.now });
  } catch (error) {
    res.status(500).json({ error: "DB_ERROR" });
  }
});

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`Backend listening on http://0.0.0.0:${port}`);
});

const shutdown = async () => {
  server.close();
  await pool.end();
};

process.on("SIGINT", () => void shutdown());
process.on("SIGTERM", () => void shutdown());
