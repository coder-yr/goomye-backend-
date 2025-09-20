import cors from "cors";
import db from "./db.js";
import dotenv from "dotenv";
import express from "express";
import AdminJS from "adminjs";
import bodyParser from "body-parser";
import session from "express-session";
import AdminJSExpress from "@adminjs/express";
import MySQLStore from "express-mysql-session";
import * as AdminJSSequelize from "@adminjs/sequelize";
import { components, loader } from "./component_loader.js";
dotenv.config();

// ADMIN AUTHENTICATION
const DEFAULT_ADMIN = {
  email: process.env.ADMINEMAIL,
  password: process.env.PASSWORD,
};
const authenticate = async (email, password) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

// EXPRESS APP
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/public", express.static("public"));
// db.sequelize.sync({ force: true });

// ADMIN PANEL
AdminJS.registerAdapter(AdminJSSequelize);
const admin = new AdminJS({
  rootPath: "/",
  databases: [db],
  settings: {
    defaultPerPage: 10,
  },
  resources: [
    {
      resource: db.megaCategory,
      options: {
        navigation: {
          icon: "BarChart2",
        },
        listProperties: ["image", "name", "slug"],
        properties: {
          image: {
            components: {
              edit: components.ImageComponent,
              list: components.ImageViewComponent,
            },
          },
          slug: {
            label: "URL",
          },
        },
      },
    },
    {
      resource: db.category,
      options: {
        navigation: {
          icon: "BarChart2",
        },
        slug: "URL",
        listProperties: ["image", "name", "slug", "megaCategoryId"],
        properties: {
          image: {
            components: {
              edit: components.ImageComponent,
              list: components.ImageViewComponent,
            },
          },

          megaCategoryId: {
            label: "Mega Category",
            reference: "mega_categories",
          },
        },
      },
    },
    {
      resource: db.subCategory,
      options: {
        navigation: {
          icon: "BarChart2",
        },
        listProperties: ["image", "name", "slug", "categoryId"],
        properties: {
          image: {
            components: {
              edit: components.ImageComponent,
              list: components.ImageViewComponent,
            },
          },

          categoryId: {
            label: "Category",
            reference: "categories",
          },
        },
      },
    },
    {
      resource: db.banners,
      options: {
        navigation: {
          icon: "Bold",
        },
        listProperties: [
          "heading",
          "tag1",
          "button1",
          "button2",
          "url",
          "active",
          "image",
        ],
        properties: {
          image: {
            components: {
              edit: components.ImageComponent,
              list: components.ImageViewComponent,
              show: components.ImageViewComponent,
            },
          },
          description: {
            type: "richtext",
          },
        },
      },
    },
    {
      resource: db.sliderBanners,
      options: {
        navigation: {
          icon: "Bold",
        },
        listProperties: ["image", "heading", "button1", "url", "active"],
        properties: {
          image: {
            components: {
              edit: components.ImageComponent,
              list: components.ImageViewComponent,
              show: components.ImageViewComponent,
            },
          },
          description: {
            type: "richtext",
          },
        },
      },
    },
    {
      resource: db.giftCardsHome,
      options: {
        navigation: {
          icon: "Bold",
        },
        listProperties: ["image", "url", "active"],
        properties: {
          image: {
            components: {
              edit: components.ImageComponent,
              list: components.ImageViewComponent,
              show: components.ImageViewComponent,
            },
          },
          description: {
            type: "richtext",
          },
        },
      },
    },
    {
      resource: db.home,
      options: {
        navigation: {
          icon: "Bold",
        },
        listProperties: ["name", "showDeal"],
        properties: {
          // TODO properties
        },
      },
    },
    {
      resource: db.productLandscape,
      options: {
        navigation: {
          icon: "Bold",
        },
        listProperties: ["image", "heading", "url", "active"],
        properties: {
          image: {
            components: {
              edit: components.ImageComponent,
              list: components.ImageViewComponent,
              show: components.ImageViewComponent,
            },
          },
          description: {
            type: "richtext",
          },
        },
      },
    },
    {
      resource: db.productSquare,
      options: {
        navigation: {
          icon: "Bold",
        },
        listProperties: ["image", "heading", "brand", "url", "active"],
        properties: {
          image: {
            components: {
              edit: components.ImageComponent,
              list: components.ImageViewComponent,
              show: components.ImageViewComponent,
            },
          },
          description: {
            type: "richtext",
          },
        },
      },
    },
    {
      resource: db.subbanners,
      options: {
        navigation: {
          icon: "Bold",
        },
        listProperties: ["image", "heading", "button1", "url", "active"],
        properties: {
          image: {
            components: {
              edit: components.ImageComponent,
              list: components.ImageViewComponent,
              show: components.ImageViewComponent,
            },
          },
          description: {
            type: "richtext",
          },
        },
      },
    },
    {
      resource: db.products,
      options: {
        navigation: {
          icon: "Heart",
        },
        listProperties: [
          "name",
          "price",
          "trendingOrder",
          "slug",
          "megaCategoryId",
          "categoryId",
          "subCategoryId",
          "active",
        ],
        properties: {
          megaCategoryId: {
            reference: "mega_categories",
          },
          categoryId: {
            reference: "categories",
          },
          subCategoryId: {
            reference: "sub_categories",
          },
          description: {
            type: "richtext",
          },

          instructions: {
            type: "richtext",
          },
          productDetails: {
            type: "key-value",
          },
          images: {
            components: {
              edit: components.UploadMultipleImage,
            },
          },
          unitsSold: {
            isVisible: {
              edit: false,
            },
          },
          otherDetails: {
            isVisible: {
              edit: false,
            },
          },
          // sizes: {
          //   components: {
          //     edit: components.SizeColorStock,
          //   },
          // },
          // sizeChart: {
          //   components: {
          //     edit: components.SizeChart,
          //   },
          // },
        },
      },
    },

    {
      resource: db.coupons,
      options: {
        navigation: {
          icon: "Bold",
        },
        listProperties: [
          "name",
          "code",
          "validity",
          "discountPercentage",
          "minimumOrder",
          "active",
        ],
      },
    },
    {
      resource: db.customers,
      options: {
        navigation: {
          icon: "Bold",
        },
        listProperties: ["name", "phone", "email"],
        properties: {
          password: {
            isVisible: false,
          },
        },
      },
    },
    {
      resource: db.addresses,
      options: {
        navigation: {
          icon: "Bold",
        },
        listProperties: ["customerId", "line1", "city", "zipcode"],

        properties: {
          customerId: {
            reference: "customers",
          },
        },
      },
    },
    {
      resource: db.orders,
      options: {
        navigation: {
          icon: "Bold",
        },
        listProperties: [
          "orderId",
          "status",
          "customerId",
          "addressId",
          "total",
        ],

        properties: {
          customerId: {
            reference: "customers",
          },
          addressId: {
            reference: "addresses",
          },
        },
      },
    },
  ],
  loginPath: "/login",
  branding: {
    companyName: "Goomye",
    favicon: "./public/logo.svg",
    logo: "./public/logo.svg",
    withMadeWithLove: false,
  },
  version: {
    admin: false,
    app: "1.0.0",
  },
  componentLoader: loader,
  dashboard: {
    component: components.DashboardComponent,
  },
  assets: {
    styles: ["./public/custom_style.css"],
  },
  logoutPath: "/logout",
});

//   await admin.initialize();
await admin.watch();

// MYSQL SESSION
const config = {
  dialect: "mysql",
  host: "127.0.0.1",
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  migrations: {
    path: "./migrations",
  },
};
const mysqlStore = MySQLStore(session);
const sessionStore = new mysqlStore({
  host: config.host,
  port: 3306,
  user: config.username,
  password: config.password,
  database: config.database,
});

// building router
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  admin,
  {
    authenticate,
    cookieName: "goomyelogin",
    cookiePassword: "sessionsecret",
  },
  null,
  {
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET_KEY,
    cookie: {
      maxAge: 86400000,
    },
  }
);
// const adminRouter = AdminJSExpress.buildRouter(admin);
app.use(admin.options.rootPath, adminRouter);

const PORT = process.env.PORT || 6002;
app.listen(PORT, () => {
  console.log(`ADMIN PANEL microservice started http://localhost:${PORT} `);
});
