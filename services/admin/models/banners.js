/* eslint-disable import/no-anonymous-default-export */
import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "banners",
    {
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      heading: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tag1: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      button1: {
        type: DataTypes.STRING,
      },
      button2: {
        type: DataTypes.STRING,
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
      tableName: "banners",
      paranoid: true,
      omitNull: true,
      freezeTableName: true,
    }
  );
};
