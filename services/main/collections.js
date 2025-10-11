import express from "express";
const router = express.Router();

// GET /api/collections - returns featured collections, banners, deals, etc.
router.get("/", async (req, res) => {
  // Static sample data for now; replace with DB later
  const collections = [
    {
      id: 1,
      brand: "cromā",
      subtitle: "COLLECTIONS",
      description: "In-House Exclusives",
      title: "Air Conditioners",
      price: "24,490",
      note: "*Inclusive of all Offers",
      bgClass: "bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600",
      image: "/images/collections/ac.png",
      alt: "Air Conditioner with remote control",
    },
    {
      id: 2,
      brand: "cromā",
      title: "Bestselling TVs",
      price: "5,590",
      note: "*Extra Exchange Benefits | Easy EMI",
      bgClass: "bg-gradient-to-br from-gray-700 via-gray-600 to-gray-500",
      image: "/images/collections/tv.png",
      alt: "Family watching TV in living room",
    },
  ];
  res.json({ collections });
});

export default router;
