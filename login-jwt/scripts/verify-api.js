import "../app/config/env.js";
import assert from "node:assert/strict";
import crypto from "node:crypto";

const base = (process.env.TEST_BASE_URL || "http://127.0.0.1:8080").replace(/\/$/, "");
const password = process.env.DEMO_PASSWORD;
assert(password, "Define DEMO_PASSWORD en el entorno local para probar las cuentas demo.");
const results = [];
async function request(route, { method = "GET", body, token, status = 200 } = {}) {
  const response = await fetch(`${base}${route}`, { method, headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(60000) });
  assert.equal(response.status, status, `${method} ${route}: se esperaba ${status}, se recibio ${response.status}`);
  const text = await response.text();
  let data; try { data = JSON.parse(text); } catch { data = text; }
  results.push(`${method} ${route}: ${status}`);
  return data;
}
try {
  assert.equal((await request("/health")).database, "connected");
  for (const route of ["/", "/login", "/registro", "/user", "/admin", "/mod"]) {
    assert.match(await request(route), /<html/);
  }
  await request("/api/no-existe", { status: 404 });
  await request("/api/test/user", { status: 401 });
  await request("/api/auth/signup", { method: "POST", body: {}, status: 400 });
  await request("/api/auth/signup", { method: "POST", body: { username: "malicioso", email: "malicioso@example.com", password: "NoDebeCrearse123", roles: ["admin"] }, status: 403 });
  await request("/api/auth/signin", { method: "POST", body: { username: "demo_user", password: "incorrecta" }, status: 401 });
  for (const [role, route] of [["user", "/api/test/user"], ["moderator", "/api/test/mod"], ["admin", "/api/test/admin"]]) {
    const session = await request("/api/auth/signin", { method: "POST", body: { username: `demo_${role}`, password } });
    assert(session.roles.includes(`ROLE_${role.toUpperCase()}`));
    assert(session.accessToken && session.refreshToken);
    await request("/api/auth/me", { token: session.accessToken });
    await request(route, { token: session.accessToken });
    if (role === "user") await request("/api/test/admin", { token: session.accessToken, status: 403 });
    const renewed = await request("/api/auth/refreshtoken", { method: "POST", body: { refreshToken: session.refreshToken } });
    await request(route, { token: renewed.accessToken });
    await request("/api/auth/signout", { method: "POST", body: { refreshToken: session.refreshToken } });
    await request("/api/auth/refreshtoken", { method: "POST", body: { refreshToken: session.refreshToken }, status: 403 });
  }
  const username = `prueba_${crypto.randomBytes(4).toString("hex")}`;
  const registration = { username, email: `${username}@example.com`, password: crypto.randomBytes(18).toString("hex") };
  await request("/api/auth/signup", { method: "POST", body: registration, status: 201 });
  await request("/api/auth/signup", { method: "POST", body: registration, status: 409 });
  const registered = await request("/api/auth/signin", { method: "POST", body: registration });
  assert.deepEqual(registered.roles, ["ROLE_USER"]);
  await request("/api/auth/signout", { method: "POST", body: { refreshToken: registered.refreshToken } });
  console.log(results.join("\n"));
  console.log(`VALIDACION CORRECTA: ${results.length} solicitudes. Solo se crea una cuenta ficticia con dominio example.com por ejecucion.`);
} catch (error) { console.error("VALIDACION FALLIDA:", error.message); process.exitCode = 1; }
