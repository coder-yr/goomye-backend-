
import express from "express";
import db from "../admin/db.js";

const router = express.Router();

router.get("/mega-menu", async (req, res) => {
  try {
    const megaMenu = await db.megaCategory.findAll({
      include: [
        {
          model: db.category,
          as: "categories",
          include: [
            {
              model: db.subCategory,
              as: "sub_categories",
            },
          ],
        },
      ],
    });
    res.json(megaMenu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
