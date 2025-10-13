import express from "express";
import { authenticateToken } from "../../main/auth.js";
import db from "../admin/db.js";

const router = express.Router();

// GET /api/products/:id/reviews - get all reviews for a product
router.get("/products/:id/reviews", async (req, res) => {
  try {
    const productId = req.params.id;
    const reviews = await db.reviews.findAll({
      where: { productId },
      order: [["createdAt", "DESC"]],
      include: [{
        model: db.customers,
        as: "customer",
        attributes: ["name", "avatarUrl"],
      }],
    });
    // Map reviews to include user info in expected format
    const mappedReviews = reviews.map(r => ({
      id: r.id,
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      date: r.createdAt,
      user: r.customer ? {
        name: r.customer.name,
        avatarUrl: r.customer.avatarUrl || undefined,
      } : { name: "Anonymous" },
      verified: true,
    }));
    res.json({ reviews: mappedReviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products/:id/reviews - add a review (auth required)
router.post("/products/:id/reviews", authenticateToken, async (req, res) => {
  try {
    const productId = req.params.id;
    const customerId = req.user?.id;
    const { rating, title, comment, recommend, photos } = req.body;
    if (!customerId) {
      return res.status(401).json({ error: "You must be signed in to submit a review." });
    }
    if (!rating || !title || !comment) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const review = await db.reviews.create({
      productId,
      customerId,
      rating,
      title,
      comment,
      recommend,
      photos: photos ? JSON.stringify(photos) : null,
      createdAt: new Date(),
    });
    res.json({ review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/user/reviews - get reviews by logged-in user
router.get("/user/reviews", authenticateToken, async (req, res) => {
  try {
    const customerId = req.user?.id;
    if (!customerId) {
      return res.status(401).json({ error: "Unauthorized: No customerId" });
    }
    const reviews = await db.reviews.findAll({
      where: { customerId },
      order: [["createdAt", "DESC"]],
      include: [{
        model: db.customers,
        as: "customer",
        attributes: ["name", "avatarUrl"],
      }],
    });
    // Map reviews to include user info in expected format
    const mappedReviews = reviews.map(r => ({
      id: r.id,
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      date: r.createdAt,
      user: r.customer ? {
        name: r.customer.name,
        avatarUrl: r.customer.avatarUrl || undefined,
      } : { name: "Anonymous" },
      verified: true,
    }));
    res.json({ reviews: mappedReviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
