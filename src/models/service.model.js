const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const ProviderProfile = require("./providerProfile.model");

const Service = sequelize.define(
  "Service",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2), // Suitable for currency
      allowNull: false,
    },
  },
  {
    tableName: "Services",
  }
);

module.exports = Service;
