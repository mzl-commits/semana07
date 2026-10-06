import "./env.js";

// DATABASE_URL selecciona PostgreSQL de Render; sin ella se mantiene MySQL.
export default {
  url: process.env.DATABASE_URL || null,
  HOST: process.env.DB_HOST || "localhost",
  USER: process.env.DB_USER || "root",
  PASSWORD: process.env.DB_PASSWORD || "",
  DB: process.env.DB_NAME || "laboratorio_jwt",
  PORT: Number(process.env.DB_PORT || 3306),
  dialect: process.env.DATABASE_URL ? "postgres" : "mysql",
  ssl: process.env.DB_SSL === "true",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
