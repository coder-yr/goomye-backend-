/* eslint-disable import/no-anonymous-default-export */
import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "addresses",
    {
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "customers",
          key: "id",
        },
      },
      line1: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      line2: {
        type: DataTypes.STRING,
      },
      landmark: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
      },
      country: {
        type: DataTypes.STRING,
      },
      zipcode: {
        type: DataTypes.STRING,
      },
      isHomeAddress: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      paranoid: true,
      omitNull: true,
      freezeTableName: true,
    }
  );
};
