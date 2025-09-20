import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "deals",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isName: (value) => {
            if (value.length < 3) {
              throw new ValidationError(
                "name must be at least 3 characters",
                []
              );
            }
          },
        },
      },
      products: {
        type: DataTypes.JSON,
      },
      showDeal: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      freezeTableName: true,
      omitNull: true,
      paranoid: true,
    }
  );
};
