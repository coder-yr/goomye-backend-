import express from "express";
const router = express.Router();

// GET /api/carousel - returns hero carousel images and links
router.get("/", async (req, res) => {
  res.json({
    carousel: [
      { id: 1, image: "/nothing-1.jpg", alt: "CMF Phone Hero Banner" },
      { id: 2, image: "/apple-imac-27.jpg", alt: "Apple iMac Hero Banner" },
      { id: 3, image: "/playstation-5-slim.png", alt: "PlayStation 5 Hero Banner" }
    ]
  });
});

export default router;
