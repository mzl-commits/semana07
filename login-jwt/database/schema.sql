-- Estructura PostgreSQL equivalente a los modelos Sequelize de la semana 7.
-- Solo tablas y roles: no contiene contraseñas, tokens ni usuarios privados.
-- La aplicacion crea esta estructura automaticamente con sequelize.sync().
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL
);
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  "createdAt" TIMESTAMPTZ NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL
);
CREATE TABLE IF NOT EXISTS "refreshTokens" (
  id SERIAL PRIMARY KEY,
  token VARCHAR(255) NOT NULL UNIQUE,
  "expiryDate" TIMESTAMPTZ NOT NULL,
  "userId" INTEGER REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  "createdAt" TIMESTAMPTZ NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL
);
CREATE TABLE IF NOT EXISTS user_roles (
  "roleId" INTEGER REFERENCES roles(id) ON DELETE CASCADE ON UPDATE CASCADE,
  "userId" INTEGER REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  "createdAt" TIMESTAMPTZ NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL,
  PRIMARY KEY ("roleId", "userId")
);
INSERT INTO roles (name, "createdAt", "updatedAt")
VALUES ('user', NOW(), NOW()), ('moderator', NOW(), NOW()), ('admin', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;
