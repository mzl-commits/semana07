export default (sequelize, Sequelize) => sequelize.define("user", {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});
