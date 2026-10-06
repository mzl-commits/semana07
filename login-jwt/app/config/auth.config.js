import "./env.js";

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error("Configura JWT_SECRET con una clave aleatoria de al menos 32 caracteres.");
}

export default {
  secret: process.env.JWT_SECRET,
  // Duracion corta para demostrar la renovacion automatica en el frontend.
  expiresIn: process.env.JWT_EXPIRES_IN || "30s",
  refreshExpiresInMs: Number(process.env.REFRESH_TOKEN_EXPIRES_MS || 7 * 24 * 60 * 60 * 1000)
};
