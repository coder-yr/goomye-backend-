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

// GET /api/account/profile - Get user profile data (merged from user + customers)
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch primary user record by userId from JWT
      const user = await db.user.findByPk(userId, {
        attributes: ["id", "name", "email", "phone", "createdAt", "updatedAt"],
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Fetch related customer record (may have extra profile fields)
    const customer = await db.customers.findOne({
      where: { userId },
      attributes: [
        "id",
        "name",
        "email",
        "phone",
        "whatsappUpdates",
        "avatarUrl",
        "isGuest",
        "createdAt",
        "updatedAt",
      ],
    });

    if (customer?.isGuest) {
      return res.status(403).json({ error: "Guest users cannot access profile." });
    }

    // Merge with customer taking precedence if present
    const profile = {
      id: user.id,
      customerId: customer?.id ?? null,
      name: customer?.name ?? user.name,
      email: customer?.email ?? user.email,
      phone: customer?.phone ?? user.phone,
        avatarUrl: customer?.avatarUrl ?? null,
      whatsappUpdates: customer?.whatsappUpdates ?? false,
      address: customer?.address ?? null,
      createdAt: (customer?.createdAt ?? user.createdAt),
      updatedAt: (customer?.updatedAt ?? user.updatedAt),
    };

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/account/profile - Update user profile (keeps user + customers in sync)
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
     const { name, email, phone, whatsappUpdates } = req.body;

    // Update primary user table
    await db.user.update(
      {
        ...(name !== undefined ? { name } : {}),
        ...(email !== undefined ? { email } : {}),
        ...(phone !== undefined ? { phone } : {}),
      },
      { where: { id: userId } }
    );

    // Update or create related customer record
    const cust = await db.customers.findOne({ where: { userId } });
    if (cust) {
      await cust.update({
        ...(name !== undefined ? { name } : {}),
        ...(email !== undefined ? { email } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(whatsappUpdates !== undefined ? { whatsappUpdates } : {}),
      });
    } else {
      await db.customers.create({
        userId,
        isGuest: false,
        name: name ?? null,
        email: email ?? null,
        phone: phone ?? null,
        whatsappUpdates: whatsappUpdates ?? false,
      });
    }

    // Return the updated profile
      const updatedUser = await db.user.findByPk(userId, { attributes: ["id", "name", "email", "phone"] });
    const updatedCustomer = await db.customers.findOne({ where: { userId } });
    const profile = {
      id: updatedUser.id,
      customerId: updatedCustomer?.id ?? null,
      name: updatedCustomer?.name ?? updatedUser.name,
      email: updatedCustomer?.email ?? updatedUser.email,
      phone: updatedCustomer?.phone ?? updatedUser.phone,
        avatarUrl: null,
      whatsappUpdates: updatedCustomer?.whatsappUpdates ?? false,
    };
    res.json({ message: "Profile updated successfully", profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;