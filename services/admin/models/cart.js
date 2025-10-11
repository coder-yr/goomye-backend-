import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "cart",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      status: {
        type: DataTypes.ENUM("active", "ordered"),
        defaultValue: "active",
      },
    },
    {
      timestamps: true,
      tableName: "cart",
    }
  );
};
