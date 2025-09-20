import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "categories",
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
      image: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: {
            msg: "Please enter a valid image url",
          },
        },
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      megaCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "mega_categories",
          key: "id",
        },
      },
    },
    {
      freezeTableName: true,
      omitNull: true,
      paranoid: true,
    }
  );
};
