import express from "express";
import db from "../admin/db.js";

const router = express.Router();

// GET /api/products - list products with basic filters
router.get("/", async (req, res) => {
  try {
    const { q, category, limit = 24, offset = 0, sort } = req.query;
    const where = { active: true };
    if (q) {
      where.name = { $like: `%${q}%` };
    }
    if (category) {
      where.category = category;
    }
    const order = [];
    if (sort === "price_asc") order.push(["price", "ASC"]);
    if (sort === "price_desc") order.push(["price", "DESC"]);
    const products = await db.products.findAll({ where, limit: Number(limit), offset: Number(offset), order, raw: true });
    const normalized = products.map((p) => ({
      ...p,
      images: typeof p.images === "string" ? (() => { try { return JSON.parse(p.images); } catch { return []; } })() : p.images,
    }));
    res.json({ products: normalized });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id - get product by id
router.get("/:id", async (req, res) => {
  try {
    const product = await db.products.findOne({
      where: { id: req.params.id, deletedAt: null, active: true },
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    // Ensure images is always an array
    if (typeof product.images === "string") {
      try {
        product.images = JSON.parse(product.images);
      } catch {
        product.images = [];
      }
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
