import express from "express";
import db from "../admin/db.js";

const router = express.Router();

// GET /api/orders/:orderId/track
router.get("/orders/:orderId/track", async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await db.orders.findOne({
      where: { orderId },
      include: [
        { model: db.customers, as: "customer" },
        { model: db.addresses, as: "address" },
        // Add associations for payment, products, etc. as needed
      ],
    });
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Example response structure (customize as needed)
    res.json({
      status: order.status,
      orderId: order.orderId,
      orderDate: order.createdAt,
      total: order.total,
      shippingAddress: order.address,
      contactDetails: {
        email: order.customer?.email,
        phone: order.customer?.phone,
      },
      paymentMethod: order.paymentMethod, // Add payment info if available
      products: order.products, // Add product details if available
      estimatedDelivery: order.estimatedDelivery, // Add if available
      progress: order.progress, // e.g., ["Order placed", "Preparing order", ...]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
