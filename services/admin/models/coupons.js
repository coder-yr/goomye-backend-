/* eslint-disable import/no-anonymous-default-export */
import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "coupons",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      canBeUsedTimes: {
        type: DataTypes.REAL,
        allowNull: false,
      },
      discountPercentage: {
        type: DataTypes.REAL,
        allowNull: false,
      },
      minimumOrder: {
        type: DataTypes.REAL,
        allowNull: false,
      },
      maxAmount: {
        type: DataTypes.REAL,
        allowNull: false,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      paranoid: true,
      omitNull: true,
      freezeTableName: true,
    }
  );
};
