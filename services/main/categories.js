import express from "express";
import db from "../admin/db.js";

const router = express.Router();

// GET /api/categories - returns all categories with details
router.get("/", async (req, res) => {
  try {
    const categories = await db.category.findAll({ raw: true });
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

export default router;
