import express from "express";
import db from "../admin/db.js";
import { authMiddleware } from "./auth.js";

const router = express.Router();

// GET /api/account/stats - Get user stats (favorites, orders, reviews, returns)
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    // Query real stats from DB
    const totalOrders = await db.orders.count({ where: { customerId: userId } });
    const reviewsAdded = await db.reviews.count({ where: { customerId: userId } });
    const productReturns = await db.returns.count({ where: { customerId: userId } });
    // For favorites, you may need a favorites table or use a static value for now
    res.json({
      favoriteProducts: 0, // Replace with real query if available
      totalOrders,
      reviewsAdded,
      productReturns
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/account/orders - Get active orders
router.get("/orders", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await db.orders.findAll({ where: { customerId: userId } });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/account/addresses - Get user's addresses
router.get("/addresses", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await db.addresses.findAll({ where: { customerId: userId } });
    res.json({ addresses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/account/cards - Get user's saved cards
router.get("/cards", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const cards = await db.cards.findAll({ where: { customerId: userId } });
    res.json({ cards });
  } catch (err) {
    // Development fallback: return sample data rather than failing the UI
    const sample = [
      { id: 1, brand: "visa", last4: "4242", expiryMonth: 12, expiryYear: 2027, isDefault: true },
      { id: 2, brand: "mastercard", last4: "4444", expiryMonth: 6, expiryYear: 2026, isDefault: false },
    ];
    try {
      // If headers indicate production, keep error semantics
      if (process.env.NODE_ENV === "production") {
        return res.status(500).json({ error: err.message });
      }
    } catch {}
    res.json({ cards: sample });
  }
});

// GET /api/account/profile - Get user profile data
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await db.customers.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/account/profile - Update user profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone, country } = req.body;
    await db.customers.update(
      { name, email, phone, country },
      {
        where: { id: userId }
      }
    );
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;