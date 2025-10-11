import express from "express";
const router = express.Router();

// GET /api/content/:section - returns static content for a section
router.get("/:section", async (req, res) => {
  const { section } = req.params;
  if (section === "branded") {
    return res.json({
      items: [
        { id: 1, brand: "LG", title: "Soundbars", price: "6,490", image: "/images/brands/soundbar.jpg", alt: "LG Soundbar" },
        { id: 2, brand: "PHILIPS Crompton", title: "Irons & Garment Steamers", price: "499", image: "/images/brands/iron.jpg", alt: "Philips Garment Steamer" },
        { id: 3, title: "Android Tablets", price: "11,749", image: "/images/brands/tablet.jpg", alt: "Android Tablet" },
        { id: 4, brand: "SAMSUNG", title: "Galaxy Fit3", subtitle: "Smartwatches", price: "2,799", image: "/images/brands/watch.jpg", alt: "Samsung Galaxy Fit3 Smartwatch" },
      ],
    });
  }
  if (section === "curated") {
    return res.json({
      items: [
        { id: 1, icon: "Package", label: "Bundles" },
        { id: 2, icon: "Truck", label: "Fast Delivery" },
        { id: 3, icon: "Tv", label: "Electronics" },
        { id: 4, icon: "Tag", label: "Best Deals" },
        { id: 5, icon: "Percent", label: "Discounts" },
        { id: 6, icon: "Crown", label: "Premium" },
      ],
    });
  }
  if (section === "gifts") {
    return res.json({
      items: [
        { id: 1, image: "/images/gifts/gift-cards.png", alt: "Croma gift cards - E-Gift Card and Indulge premium appliances" },
      ],
    });
  }
  return res.json({ section, items: [] });
});

export default router;
