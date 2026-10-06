import jwt from "jsonwebtoken";
import authConfig from "../config/auth.config.js";
import db from "../models/index.js";

const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).send({ message: "No se proporciono token de acceso." });

  jwt.verify(token, authConfig.secret, (error, decoded) => {
    if (error) return res.status(401).send({ message: "Token invalido o expirado." });
    req.userId = decoded.id;
    next();
  });
};

const hasRole = (roleName) => async (req, res, next) => {
  try {
    const user = await db.user.findByPk(req.userId);
    if (!user) return res.status(404).send({ message: "Usuario no encontrado." });
    const roles = await user.getRoles();
    if (roles.some((role) => role.name === roleName)) return next();
    return res.status(403).send({ message: `Se requiere el rol ${roleName}.` });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const isAdmin = hasRole("admin");
const isModerator = hasRole("moderator");
const isModeratorOrAdmin = async (req, res, next) => {
  try {
    const user = await db.user.findByPk(req.userId);
    const roles = user ? await user.getRoles() : [];
    if (roles.some((role) => ["moderator", "admin"].includes(role.name))) return next();
    return res.status(403).send({ message: "Se requiere el rol moderator o admin." });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

export default { verifyToken, isAdmin, isModerator, isModeratorOrAdmin };
