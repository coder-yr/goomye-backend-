import express from "express";
const router = express.Router();

// POST /api/checkout/guest - Guest checkout endpoint
router.post("/guest", (req, res) => {
  // In a real app, validate and save order, address, etc.
  // For now, just return a mock confirmation
  const { email, shippingAddress, shippingMethod, cart } = req.body;

  // Mock order confirmation response
  const orderConfirmation = {
    orderId: 12345,
    status: "confirmed",
    message: "Order placed successfully!",
    email,
    shippingAddress,
    shippingMethod,
    cart,
    estimatedDelivery: "2025-09-25",
    total: 229,
    currency: "USD"
  };

  res.status(201).json(orderConfirmation);
});

export default router;
