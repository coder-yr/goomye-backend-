
import express from "express";
const router = express.Router();

// GET /api/cart - Returns mock cart data for now
router.get('/', (req, res) => {
  // Sample cart data structure
  const cart = {
    items: [
      {
        productId: 1,
        name: 'Sample Product',
        image: 'https://via.placeholder.com/100',
        price: 499,
        quantity: 2,
        subtotal: 998
      },
      {
        productId: 2,
        name: 'Another Product',
        image: 'https://via.placeholder.com/100',
        price: 299,
        quantity: 1,
        subtotal: 299
      }
    ],
    total: 1297,
    currency: 'INR'
  };
  res.json(cart);
});

export default router;
