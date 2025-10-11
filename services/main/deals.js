import express from "express";
import db from "../admin/db.js";
const router = express.Router();

// GET /api/deals - returns promotional deals
router.get("/deals", async (req, res) => {
  try {
    // Get top 8 trending products (or deals)
    const products = await db.products.findAll({
      where: { active: true },
      order: [["trendingOrder", "DESC"]],
      limit: 8,
      raw: true,
    });
    // Map to frontend deal shape
    const deals = products.map((p) => ({
      id: p.id,
      title: p.name,
      price: p.price,
      originalPrice: p.mrp,
      image: Array.isArray(p.images) ? p.images[0] : p.images,
      rating: 4,
      alt: p.name,
    }));
    res.json({ deals });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch deals" });
  }
});

export default router;
