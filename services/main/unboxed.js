import express from "express";
const router = express.Router();

// GET /api/unboxed - returns unboxed products/reviews
router.get("/", async (req, res) => {
  const unboxed = [
    {
      id: 1,
      badge: "UNBOXED",
      subtitle: "BY cromā",
      title:
        "Ten years on the wrist, and the Apple Watch has gone from a glorified accessory to a necessity",
      description: "10 years of the iconic Apple Watch",
      image: "/images/unboxed/apple-watch-unboxed.jpg",
      alt: "Apple Watch collection with different bands",
    },
  ];
  res.json({ unboxed });
});

export default router;
