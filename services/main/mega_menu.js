
import express from "express";
import db from "../admin/db.js";

const router = express.Router();

router.get("/mega-menu", async (req, res) => {
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

export default router;
