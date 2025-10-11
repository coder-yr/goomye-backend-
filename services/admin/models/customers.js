/* eslint-disable import/no-anonymous-default-export */
import { DataTypes } from "sequelize";
import { hashSync } from "bcrypt";

export default (sequelize) => {
  return sequelize.define(
    "customers",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      whatsappUpdates: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      avatarUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Reference to the authenticated user ID'
      },
      isGuest: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      paranoid: true,
      omitNull: true,
      freezeTableName: true,
    }
  );
};
