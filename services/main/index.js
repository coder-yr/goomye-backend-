import orderDetailsRouter from "./order_details.js";
import orderTrackRouter from "./order_track.js";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import uploadRouter from "./upload_file.js";
import megaMenuRouter from "./mega_menu.js";
import authRouter from "./auth.js";
import cartRouter from "./cart.js";
import checkoutRouter from "./checkout.js";
import checkoutLoggedinRouter from "./checkout_loggedin.js";
import reviewPayRouter from "./review_pay.js";
import myOrdersRouter from "./my_orders.js";
import productReviewsRouter from "./product_reviews.js";
import returnsRouter from "./returns.js";
dotenv.config();

// EXPRESS APP
const app = express();
app.use(cors());
app.use("/images", express.static("images"));
app.use(express.json());
app.use("/api", uploadRouter);
app.use("/api", megaMenuRouter);
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

// /api/products/:productId/reviews for product reviews

// /api/products/:productId/reviews for product reviews
app.use("/api/products", productReviewsRouter);

// /api/returns/products for product return endpoints
app.use("/api/returns", returnsRouter);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

const PORT = 8001;
app.listen(PORT, () => {
  console.log(`MAIN BACKEND microservice started http://localhost:${PORT} `);
});
