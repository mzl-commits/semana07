import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
import authConfig from "../config/auth.config.js";

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).send({ message: "username, email y password son obligatorios." });
    }

    await db.sequelize.transaction(async (transaction) => {
      const user = await db.user.create({ username, email, password: await bcrypt.hash(password, 10) }, { transaction });
      const role = await db.role.findOne({ where: { name: "user" }, transaction });
      await user.setRoles([role], { transaction });
    });
    res.status(201).send({ message: "Usuario registrado correctamente." });
  } catch (error) {
    const conflict = error.name === "SequelizeUniqueConstraintError";
    res.status(conflict ? 409 : 500).send({ message: conflict ? "El usuario o email ya esta en uso." : "No fue posible registrar el usuario." });
  }
};

const signin = async (req, res) => {
  try {
    if (typeof req.body?.username !== "string" || typeof req.body?.password !== "string") return res.status(400).json({ message: "Usuario y contraseña son obligatorios." });
    const user = await db.user.findOne({ where: { username: req.body.username } });
    if (!user) return res.status(401).send({ message: "Usuario o contraseña incorrectos." });
    if (!bcrypt.compareSync(req.body.password || "", user.password)) {
      return res.status(401).send({ accessToken: null, message: "Usuario o contraseña incorrectos." });
    }

    const roles = await user.getRoles();
    const accessToken = jwt.sign({ id: user.id }, authConfig.secret, { expiresIn: authConfig.expiresIn });
    const refreshToken = await db.refreshToken.createToken(user, authConfig.refreshExpiresInMs);
    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: roles.map((role) => `ROLE_${role.name.toUpperCase()}`),
      accessToken,
      refreshToken: refreshToken.token
    });
  } catch (error) {
    res.status(500).send({ message: "No fue posible iniciar sesion." });
  }
};

const refreshToken = async (req, res) => {
  try {
    const tokenValue = req.body.refreshToken;
    if (!tokenValue) return res.status(400).send({ message: "El refreshToken es obligatorio." });
    const token = await db.refreshToken.findOne({ where: { token: tokenValue }, include: [db.user] });
    if (!token) return res.status(403).send({ message: "El refreshToken no existe o fue invalidado." });
    if (db.refreshToken.verifyExpiration(token)) {
      await token.destroy();
      return res.status(403).send({ message: "El refreshToken expiró. Inicia sesión nuevamente." });
    }
    const accessToken = jwt.sign({ id: token.user.id }, authConfig.secret, { expiresIn: authConfig.expiresIn });
    res.status(200).send({ accessToken, refreshToken: token.token });
  } catch (error) { res.status(500).send({ message: "No fue posible renovar la sesion." }); }
};

const signout = async (req, res) => {
  try {
    if (!req.body.refreshToken) return res.status(400).send({ message: "El refreshToken es obligatorio." });
    const deleted = await db.refreshToken.destroy({ where: { token: req.body.refreshToken } });
    if (!deleted) return res.status(404).send({ message: "RefreshToken no encontrado." });
    res.status(200).send({ message: "Sesión cerrada correctamente." });
  } catch (error) { res.status(500).send({ message: "No fue posible cerrar la sesion." }); }
};

const me = async (req, res) => {
  try {
    const user = await db.user.findByPk(req.userId, { attributes: ["id", "username", "email"], include: [{ model: db.role, attributes: ["name"], through: { attributes: [] } }] });
    if (!user) return res.status(401).json({ message: "Usuario no disponible." });
    res.json({ id: user.id, username: user.username, email: user.email, roles: user.roles.map((role) => `ROLE_${role.name.toUpperCase()}`) });
  } catch { res.status(500).json({ message: "No fue posible obtener la sesion." }); }
};

export default { signup, signin, refreshToken, signout, me };
