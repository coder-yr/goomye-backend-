import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "cart_item",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      cartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "cart",
          key: "id",
        },
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      color: {
        type: DataTypes.STRING,
      },
      size: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
      tableName: "cart_item",
    }
  );
};
