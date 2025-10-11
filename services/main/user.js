
import express from "express";
import { authenticateToken } from "../../main/auth.js";
const router = express.Router();


// GET /api/user/profile - returns user profile (protected)
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const db = (await import("../../admin/db.js")).default;
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ error: "Missing user id" });
    const user = await db.user.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    // Only return safe fields
    const profile = {
      name: user.name,
      email: user.email,
      phone: user.phone
    };
    res.json({ profile });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile", details: err.message });
  }
});

// In-memory wishlist for development fallback
const devWishlist = new Map(); // key: userId -> array of items

// GET /api/user/wishlist - returns user wishlist (protected)
router.get("/wishlist", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id || "anon";
    const list = devWishlist.get(userId) || [];
    res.json({ wishlist: list });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
});

// POST /api/user/wishlist - add item { id, name, image, price }
router.post("/wishlist", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id || "anon";
    const { id, name, image, price } = req.body || {};
    if (!id) return res.status(400).json({ error: "Missing id" });
    const list = devWishlist.get(userId) || [];
    if (!list.find((x) => x.id === id)) list.push({ id, name, image, price });
    devWishlist.set(userId, list);
    res.json({ wishlist: list });
  } catch (err) {
    res.status(500).json({ error: "Failed to add to wishlist" });
  }
});

// DELETE /api/user/wishlist/:id - remove item
router.delete("/wishlist/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id || "anon";
    const id = req.params.id;
    const list = devWishlist.get(userId) || [];
    const next = list.filter((x) => String(x.id) !== String(id));
    devWishlist.set(userId, next);
    res.json({ wishlist: next });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove from wishlist" });
  }
});

export default router;
