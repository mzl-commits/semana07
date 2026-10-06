import "../app/config/env.js";
import db from "../app/models/index.js";

try {
  await db.sequelize.authenticate();
  const tables = await db.sequelize.getQueryInterface().showAllTables();
  const roles = await db.role.findAll({ attributes: ["name"], order: [["name", "ASC"]], raw: true });
  const demos = await db.user.findAll({ where: { username: ["demo_user", "demo_moderator", "demo_admin"] }, attributes: ["username"], include: [{ model: db.role, attributes: ["name"], through: { attributes: [] } }] });
  console.log(JSON.stringify({ connected: true, tables, roles: roles.map((role) => role.name), demoAccounts: demos.map((user) => ({ username: user.username, roles: user.roles.map((role) => role.name) })) }, null, 2));
} catch (error) {
  console.error("No se pudo comprobar la base:", error.name, error.original?.code || "");
  process.exitCode = 1;
} finally { await db.sequelize.close(); }
