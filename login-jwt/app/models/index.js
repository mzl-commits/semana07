import Sequelize from "sequelize";
import dbConfig from "../config/db.config.js";
import defineUser from "./user.model.js";
import defineRole from "./role.model.js";
import defineRefreshToken from "./refreshToken.model.js";

const options = {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
  logging: false,
  ...(dbConfig.ssl ? { dialectOptions: { ssl: { require: true, rejectUnauthorized: true } } } : {})
};
const sequelize = dbConfig.url
  ? new Sequelize(dbConfig.url, options)
  : new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, options);

const db = { Sequelize, sequelize };
db.user = defineUser(sequelize, Sequelize);
db.role = defineRole(sequelize, Sequelize);
db.refreshToken = defineRefreshToken(sequelize, Sequelize);

db.role.belongsToMany(db.user, { through: "user_roles" });
db.user.belongsToMany(db.role, { through: "user_roles" });
db.user.hasMany(db.refreshToken, { onDelete: "CASCADE" });
db.refreshToken.belongsTo(db.user, { onDelete: "CASCADE" });
db.ROLES = ["user", "admin", "moderator"];

export default db;
