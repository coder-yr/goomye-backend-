/* eslint-disable import/no-anonymous-default-export */
import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "products",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      images: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      youtubeUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      subHeading: {
        type: DataTypes.STRING,
      },
      tagLine: {
        type: DataTypes.STRING,
      },
      megaCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "mega_categories",
          key: "id",
        },
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "categories",
          key: "id",
        },
      },
      subCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "sub_categories",
          key: "id",
        },
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      trendingOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      listingOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      mrp: {
        type: DataTypes.REAL,
        allowNull: false,
        defaultValue: 0,
      },
      price: {
        type: DataTypes.REAL,
        allowNull: false,
        defaultValue: 0,
      },
      discount: {
        type: DataTypes.REAL,
        allowNull: false,
        defaultValue: 0,
      },
      shortcode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      description: {
        type: DataTypes.TEXT,
      },
      productDetails: {
        type: DataTypes.JSON,
      },
      instructions: {
        type: DataTypes.TEXT,
      },
      taxRate: {
        type: DataTypes.REAL,
        defaultValue: 5,
      },
      isTaxIncluded: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

    //   sizes: {
    //     type: DataTypes.JSON,
    //     allowNull: false,

    //     /**
    //      * size,color,active and their inventory count
    //      */
    //   },

      //   sizeChart: {
      //     type: DataTypes.JSON,
      //   },

      alibabaUrl: {
        type: DataTypes.STRING,
      },
      flipkartLink: {
        type: DataTypes.STRING,
      },
      myntraLink: {
        type: DataTypes.STRING,
      },
      amazonLink: {
        type: DataTypes.STRING,
      },
      isNewArrival: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      unitsSold: {
        type: DataTypes.REAL,
        defaultValue: 0,
      },
      otherDetails: {
        type: DataTypes.JSON,
      },
    },
    {
      tableName: "products",
      paranoid: true,
      omitNull: true,
      freezeTableName: true,
    }
  );
};
