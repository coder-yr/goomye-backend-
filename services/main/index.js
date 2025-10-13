import orderDetailsRouter from "./order_details.js";
import orderTrackRouter from "./order_track.js";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import uploadRouter from "./upload_file.js";
import accountRouter from "./account.js";
import megaMenuRouter from "./mega_menu.js";
import authRouter from "./auth.js";
import cartRouter from "./cart.js";
import checkoutRouter from "./checkout.js";
import checkoutLoggedinRouter from "./checkout_loggedin.js";
import reviewPayRouter from "./review_pay.js";
import myOrdersRouter from "./my_orders.js";
import reviewRouter from "./review.js";
import productRouter from "./product.js";
import returnsRouter from "./returns.js";
import collectionsRouter from "./collections.js";
import carouselRouter from "./carousel.js";
import dealsRouter from "./deals.js";
import bannersRouter from "./banners.js";
import unboxedRouter from "./unboxed.js";
import userRouter from "./user.js";
import contentRouter from "./content.js";
import categoriesRouter from "./categories.js";
import debugOrdersRouter from "./debug_orders.js";
dotenv.config();
 

// EXPRESS APP
const app = express();
app.use(cors());
app.use(express.static("public")); // Serve public folder for static files
app.use("/images", express.static("images"));
app.use(express.json());

app.use("/api", uploadRouter);
app.use("/api", megaMenuRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/auth", authRouter);
app.use("/api", orderTrackRouter);
app.use("/api", orderDetailsRouter);

app.use("/api/cart", cartRouter);

app.use("/api/checkout", checkoutRouter);

// /api/checkout (POST) for logged-in users
app.use("/api/checkout", checkoutLoggedinRouter);

// /api/checkout/pay for review and pay step
app.use("/api/checkout", reviewPayRouter);

// /api/orders for my orders list
app.use("/api/orders", myOrdersRouter);

// Debug endpoint for troubleshooting
app.use("/api", debugOrdersRouter);
app.use("/api/collections", collectionsRouter);
app.use("/api/carousel", carouselRouter);
app.use("/api", dealsRouter);
app.use("/api/banners", bannersRouter);
app.use("/api/unboxed", unboxedRouter);
app.use("/api/user", userRouter);
app.use("/api/content", contentRouter);
app.use("/api/account", accountRouter);

// /api/products/:productId/reviews for product reviews

// /api/products/:productId/reviews for product reviews
app.use("/api/products", productRouter);
app.use("/api", reviewRouter);

// /api/returns/products for product return endpoints
app.use("/api/returns", returnsRouter);

// Dynamic MegaMenu endpoint
app.get('/api/mega-menu', async (req, res) => {
  try {
    // Get all mega categories
    const megaCategories = await db.megaCategory.findAll({ raw: true });
    // Get all categories
    const categories = await db.category.findAll({ raw: true });
    // Get all subcategories
    const subCategories = await db.subCategory.findAll({ raw: true });

    // Build nested structure
    const menu = {};
    megaCategories.forEach(mega => {
      menu[mega.name] = {};
      const cats = categories.filter(cat => cat.megaCategoryId === mega.id);
      cats.forEach(cat => {
        menu[mega.name][cat.name] = [];
        const subs = subCategories.filter(sub => sub.categoryId === cat.id);
        subs.forEach(sub => {
          menu[mega.name][cat.name].push(sub.name);
        });
      });
    });
    res.json({ menu });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch mega menu data' });
  }
});

app.get("/", (req, res) => {
  res.send("Backend is running!");
  console.log(`MAIN BACKEND microservice started http://localhost:${PORT} `);
});

const PORT = 8001;
app.listen(PORT, () => {
  console.log(`MAIN BACKEND microservice started http://localhost:${PORT} `);
});
