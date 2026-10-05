const http = require("node:http");
const path = require("node:path");
require("dotenv").config({ path: path.join(__dirname, ".env"), quiet: true });

// Render proporciona PORT. En local se usa .env o el puerto alternativo 3000.
const PORT = Number(process.env.PORT || 3000);
if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  console.error("PORT debe ser un numero entero entre 1 y 65535.");
  process.exit(1);
}

const pagina = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>despliegue01 | Laboratorio 8</title>
</head>
<body>
  <main>
  <h1>¡Hola, mundo!</h1>
    <h2>despliegue01</h2>
    <p>La aplicación Node.js del Laboratorio N.° 8 está funcionando.</p>
    <p>Preparada para ejecutarse localmente y desplegarse en Render.</p>
    <p><a href="/health">Comprobar el estado del servidor</a></p>
  </main>
</body>
</html>`;

const server = http.createServer((req, res) => {
  const ruta = req.url.split("?")[0];
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { "Content-Type": "application/json; charset=utf-8", Allow: "GET, HEAD" });
    return res.end(JSON.stringify({ error: "Metodo no permitido" }));
  }
  if (ruta === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(req.method === "HEAD" ? undefined : pagina);
  }
  if (ruta === "/health") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
    return res.end(req.method === "HEAD" ? undefined : JSON.stringify({ status: "ok", application: "despliegue01" }));
  }
  res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
  res.end(req.method === "HEAD" ? undefined : JSON.stringify({ error: "Ruta no encontrada" }));
});

server.on("error", (error) => {
  console.error("No se pudo iniciar el servidor:", error.message);
  process.exit(1);
});

// 0.0.0.0 permite que Render acceda al servidor desde su red.
server.listen(PORT, "0.0.0.0", () => {
  console.log(`despliegue01 funcionando en http://localhost:${PORT}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    console.log(`Cerrando servidor (${signal})...`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10000).unref();
  });
}
