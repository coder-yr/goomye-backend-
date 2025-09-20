import express from "express";
const router = express.Router();

// GET /api/orders/:orderId/details
router.get("/orders/:orderId/details", (req, res) => {
  // Enhanced mock order confirmation details
  const orderDetails = {
    orderId: req.params.orderId,
    status: 'confirmed',
    paymentStatus: 'Paid',
    customerEmail: 'jamescollins@site.so',
    summary: {
      subtotal: 229,
      shipping: 0,
      estimatedTax: 0,
      promoCode: 0,
      sale: -20,
      total: 229,
      currency: 'USD'
    },
    items: [
      {
        productId: 1,
        name: 'Nike Air Force 1',
        image: 'https://via.placeholder.com/100',
        price: 150,
        quantity: 1,
        subtotal: 150,
        color: 'White',
        size: 'M'
      },
      {
        productId: 2,
        name: 'Camo Blend Jacket',
        image: 'https://via.placeholder.com/100',
        price: 60,
        salePrice: 40,
        quantity: 1,
        subtotal: 40,
        color: 'Camo',
        size: 'M'
      },
      {
        productId: 3,
        name: 'Mahabis Classic',
        image: 'https://via.placeholder.com/100',
        price: 39,
        quantity: 1,
        subtotal: 39,
        color: 'White',
        size: 'M'
      }
    ],
    timeline: [
      { status: 'Order placed', date: '2025-09-18T09:03:00Z', completed: true },
      { status: 'Shipped', date: null, completed: false },
      { status: 'Out for delivery', date: null, completed: false },
      { status: 'Delivered', date: null, completed: false }
    ],
    message: 'Order placed successfully! An order confirmation has been sent to jamescollins@site.so.'
  };
  res.json(orderDetails);
});

export default router;
