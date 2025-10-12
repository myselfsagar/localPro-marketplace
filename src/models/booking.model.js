const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Booking = sequelize.define(
  "Booking",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bookingDate: {
      type: DataTypes.DATE, // Stores both the date and time of the appointment
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "pending", // A new booking will always start as 'pending'
    },
  },
  {
    tableName: "Bookings",
  }
);

module.exports = Booking;
