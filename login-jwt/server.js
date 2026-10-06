import "./app/config/env.js";
import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import bcrypt from "bcryptjs";
import db from "./app/models/index.js";
import dbConfig from "./app/config/db.config.js";
import authRoutes from "./app/routes/auth.routes.js";
import userRoutes from "./app/routes/user.routes.js";

const app = express();
const PORT = Number(process.env.PORT || 8080);
const frontendDir = fileURLToPath(new URL("./tarea/dist/", import.meta.url));
if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) throw new Error("PORT no es valido.");
app.disable("x-powered-by");
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});
if (process.env.CORS_ORIGIN) app.use(cors({ origin: process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim()) }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: false, limit: "16kb" }));
app.get("/health", async (_req, res) => {
  try {
    await db.sequelize.authenticate();
    res.json({ status: "ok", database: "connected", dialect: dbConfig.dialect });
  } catch { res.status(503).json({ status: "unavailable", database: "disconnected" }); }
});
app.use("/api/auth", authRoutes);
app.use("/api/test", userRoutes);
app.use("/api", (_req, res) => res.status(404).json({ message: "Ruta de API no encontrada." }));
if (existsSync(path.join(frontendDir, "index.html"))) {
  app.use(express.static(frontendDir));
  // Express 5: conserva las rutas directas del frontend React.
  app.get(/^\/(?!api(?:\/|$)|health(?:\/|$)|assets(?:\/|$)).*/, (_req, res) => res.sendFile(path.join(frontendDir, "index.html")));
} else if (process.env.NODE_ENV === "production") {
  throw new Error("Falta tarea/dist/index.html. Ejecuta npm run build antes de iniciar.");
} else app.get("/", (_req, res) => res.json({ message: "API JWT disponible. Ejecuta npm run build para servir el frontend." }));
app.use((error, _req, res, _next) => {
  console.error("Solicitud fallida:", error.name);
  res.status(error.status || 500).json({ message: error.status === 400 ? "Solicitud JSON invalida." : "No se pudo procesar la solicitud." });
});

async function initializeDatabase() {
  if (dbConfig.dialect === "mysql") {
    if (!/^[a-zA-Z0-9_]+$/.test(dbConfig.DB)) throw new Error("DB_NAME no es valido.");
    const connection = await mysql.createConnection({ host: dbConfig.HOST, port: dbConfig.PORT, user: dbConfig.USER, password: dbConfig.PASSWORD });
    try { await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.DB}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`); }
    finally { await connection.end(); }
  }
  await db.sequelize.authenticate();
  // Crea solo las tablas faltantes; no elimina ni reemplaza datos.
  await db.sequelize.sync();
  console.log("Tablas disponibles:", (await db.sequelize.getQueryInterface().showAllTables()).join(", "));
  for (const name of ["user", "moderator", "admin"]) await db.role.findOrCreate({ where: { name } });
  if (process.env.SEED_DEMO === "true") {
    const password = process.env.DEMO_PASSWORD;
    if (!password || password.length < 12) throw new Error("DEMO_PASSWORD debe tener al menos 12 caracteres.");
    await db.sequelize.transaction(async (transaction) => {
      for (const name of ["user", "moderator", "admin"]) {
        const username = `demo_${name}`;
        const [user, created] = await db.user.findOrCreate({ where: { username }, defaults: { username, email: `${username}@example.com`, password: await bcrypt.hash(password, 10) }, transaction });
        if (created) {
          const role = await db.role.findOne({ where: { name }, transaction });
          await user.setRoles([role], { transaction });
        }
      }
    });
    console.log("Cuentas de demostracion inicializadas; sus claves no se muestran en los logs.");
  }
  console.log(`Base de datos conectada (${dbConfig.dialect}); tablas y roles disponibles.`);
}
try {
  await initializeDatabase();
  const server = app.listen(PORT, "0.0.0.0", () => console.log(`Servidor JWT ejecutandose en el puerto ${PORT}`));
  server.on("error", (error) => { console.error("No se pudo abrir el puerto:", error.code); process.exit(1); });
  for (const signal of ["SIGTERM", "SIGINT"]) process.on(signal, () => {
    server.close(async () => { await db.sequelize.close(); process.exit(0); });
    setTimeout(() => process.exit(1), 10000).unref();
  });
} catch (error) {
  console.error("No se pudo iniciar la aplicacion:", error.name, error.original?.code || "");
  await db.sequelize.close();
  process.exit(1);
}
