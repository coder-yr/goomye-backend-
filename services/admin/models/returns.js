import { DataTypes } from "sequelize";
import db from "../db.js";

const Returns = db.define("returns", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reason: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected", "completed"),
    defaultValue: "pending",
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default Returns;