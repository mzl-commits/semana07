import db from "../models/index.js";

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const userByUsername = await db.user.findOne({ where: { username } });
    if (userByUsername) return res.status(409).send({ message: "El username ya esta en uso." });

    const userByEmail = await db.user.findOne({ where: { email } });
    if (userByEmail) return res.status(409).send({ message: "El email ya esta en uso." });
    next();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    const roles = Array.isArray(req.body.roles) ? req.body.roles : [req.body.roles];
    for (const role of roles) {
      if (!db.ROLES.includes(role)) {
        return res.status(400).send({ message: `El rol '${role}' no es valido.` });
      }
      if (role !== "user") return res.status(403).json({ message: "El registro publico solo permite el rol user." });
    }
  }
  next();
};

const validateSignup = (req, res, next) => {
  const { username, email, password } = req.body || {};
  if (typeof username !== "string" || username.trim().length < 3 || username.length > 50 || typeof email !== "string" || email.length > 254 || !/^\S+@\S+\.\S+$/.test(email) || typeof password !== "string" || password.length < 6 || Buffer.byteLength(password) > 72) {
    return res.status(400).json({ message: "Usuario de 3 a 50 caracteres, email valido y contraseña de 6 caracteres como minimo (maximo 72 bytes)." });
  }
  req.body.username = username.trim();
  req.body.email = email.trim().toLowerCase();
  next();
};

export default { validateSignup, checkDuplicateUsernameOrEmail, checkRolesExisted };
