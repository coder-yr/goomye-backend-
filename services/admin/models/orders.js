/* eslint-disable import/no-anonymous-default-export */
import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "orders",
    {
      orderId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          "Created",
          "Accepted",
          "Ready To Ship",
          "Dispatched",
          "In Transist",
          "Delivered",
          "Returned",
          "Cancelled"
        ),
        allowNull: false,
        defaultValue: "Created",
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "customers",
          key: "id",
        },
      },
      addressId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "addresses",
          key: "id",
        },
      },
      products: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      subTotal: {
        type: DataTypes.REAL,
        allowNull: false,
      },
      discount: {
        type: DataTypes.REAL,
        allowNull: false,
      },
      total: {
        type: DataTypes.REAL,
        allowNull: false,
      },
      taxes: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      couponCode: {
        type: DataTypes.STRING,
      },
      changeLogs: {
        type: DataTypes.JSON,
      },
      shippingDetails: {
        type: DataTypes.JSON,
      },
    },
    {
      paranoid: true,
      omitNull: true,
      freezeTableName: true,
    }
  );
};
