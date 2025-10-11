import express from "express";
const router = express.Router();

// GET /api/banners - returns promotional banners
router.get("/", async (req, res) => {
  const banners = [
    {
      id: 1,
      title: "Summer Mega Sale",
      subtitle: "Up to 50% off on ACs",
      image: "/images/banners/ac-hero.jpg",
      link: "/products?category=Air%20Conditioners",
      theme: "sky",
    },
    {
      id: 2,
      title: "TV Bonanza",
      subtitle: "Exchange offers + No Cost EMI",
      image: "/images/banners/tv-hero.jpg",
      link: "/products?category=Televisions",
      theme: "zinc",
    },
  ];
  res.json({ banners });
});

export default router;
