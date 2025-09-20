/* eslint-disable import/no-anonymous-default-export */
import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "product_square_home",
    {
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      heading: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      brand: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subHeading: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "product_square_home",
      paranoid: true,
      omitNull: true,
      freezeTableName: true,
    }
  );
};
