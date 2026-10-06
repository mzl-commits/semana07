import crypto from "crypto";

export default (sequelize, Sequelize) => {
  const RefreshToken = sequelize.define("refreshToken", {
    token: { type: Sequelize.STRING, allowNull: false, unique: true },
    expiryDate: { type: Sequelize.DATE, allowNull: false }
  });

  RefreshToken.createToken = async (user, expirationMs) => RefreshToken.create({
    token: crypto.randomUUID(),
    userId: user.id,
    expiryDate: new Date(Date.now() + expirationMs)
  });
  RefreshToken.verifyExpiration = (token) => token.expiryDate.getTime() < Date.now();
  return RefreshToken;
};
