const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const User = require("./user.model");

const ProviderProfile = sequelize.define(
  "ProviderProfile",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bio: {
      type: DataTypes.TEXT, // Use TEXT for longer descriptions
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING, // e.g., "Bengaluru, Karnataka"
      allowNull: true,
    },
    profileImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "/images/default-profile.png",
    },
  },
  {
    tableName: "ProviderProfiles",
  }
);

module.exports = ProviderProfile;
