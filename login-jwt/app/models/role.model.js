export default (sequelize, Sequelize) => sequelize.define("role", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }
});
