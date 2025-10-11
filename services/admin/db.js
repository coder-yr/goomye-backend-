import { Sequelize } from "sequelize";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
// Always load .env from the current directory (declare only once at the top)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });
import mega_category from "./models/mega_category.js";
import reviews from "./models/reviews.js";
import category from "./models/category.js";
import sub_category from "./models/subcategory.js";
import banners from "./models/banners.js";
import subbanners from "./models/sub_banners.js";
import sliderBanners from "./models/banner_sliders.js";
import giftCardsHome from "./models/card_home.js";
import home from "./models/home.js";
import productLandscape from "./models/product_landscape_home.js";
import productSquare from "./models/product_square_home.js";
import products from "./models/product.js";
import cart from "./models/cart.js";
import cart_item from "./models/cart_item.js";
import coupons from "./models/coupons.js";
import addresses from "./models/addresses.js";
import customers from "./models/customers.js";
import orders from "./models/orders.js";
import user from "./models/user.js";
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

//SETTING UP SEQUELIZE
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle,
    },
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.megaCategory = mega_category(sequelize);
db.customers = customers(sequelize);
db.reviews = reviews(sequelize);
db.category = category(sequelize);
db.subCategory = sub_category(sequelize);
db.banners = banners(sequelize);
db.sliderBanners = sliderBanners(sequelize);
db.home = home(sequelize);
db.productLandscape = productLandscape(sequelize);
db.productSquare = productSquare(sequelize);
db.giftCardsHome = giftCardsHome(sequelize);
db.products = products(sequelize);
db.cart = cart(sequelize);
db.cart_item = cart_item(sequelize);
db.subbanners = subbanners(sequelize);
db.coupons = coupons(sequelize);
db.addresses = addresses(sequelize);
db.orders = orders(sequelize);
db.user = user(sequelize);

// Debug: Log all initialized model keys
console.log("DB MODELS:", Object.keys(db));
db.orders = orders(sequelize);

// Associations for Mega Menu
db.megaCategory.hasMany(db.category, { foreignKey: "megaCategoryId", as: "categories" });
db.category.belongsTo(db.megaCategory, { foreignKey: "megaCategoryId", as: "megaCategory" });
db.category.hasMany(db.subCategory, { foreignKey: "categoryId", as: "sub_categories" });
db.subCategory.belongsTo(db.category, { foreignKey: "categoryId", as: "category" });

// Associations for Orders
db.customers.hasMany(db.orders, { foreignKey: "customerId", as: "orders" });
db.orders.belongsTo(db.customers, { foreignKey: "customerId", as: "customer" });
db.addresses.hasMany(db.orders, { foreignKey: "addressId", as: "orders" });
db.orders.belongsTo(db.addresses, { foreignKey: "addressId", as: "address" });

// Association for Reviews to Customer
db.reviews.belongsTo(db.customers, { foreignKey: "customerId", as: "customer" });

// Cart and CartItem associations
db.cart.hasMany(db.cart_item, { foreignKey: "cartId", as: "items" });
db.cart_item.belongsTo(db.cart, { foreignKey: "cartId", as: "cart" });
db.cart_item.belongsTo(db.products, { foreignKey: "productId", as: "products" });
// Sync models to DB (creates tables if not exist)
import process from "process";
if (process.env.NODE_ENV !== "production") {
  db.sequelize.sync({ alter: true })
    .then(() => console.log("Database synced!"))
    .catch((err) => console.error("DB sync error:", err));
}

export default db;
