import { DataTypes } from "sequelize";
import db from "../db.js";

const Cards = db.define("cards", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  last4: {
    type: DataTypes.STRING(4),
    allowNull: false,
  },
  expiryMonth: {
    type: DataTypes.STRING(2),
    allowNull: false,
  },
  expiryYear: {
    type: DataTypes.STRING(4),
    allowNull: false,
  },
  cardType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default Cards;