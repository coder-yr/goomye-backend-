import express from "express";
const router = express.Router();


import db from "../admin/db.js";
import { authMiddleware } from "./auth.js";

// GET /api/returns/products - List products eligible for return (ordered by user)
router.get('/products', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    // Find all orders for this user
    const orders = await db.orders.findAll({ where: { customerId: userId } });
    // Collect all products from these orders
    let products = [];
    for (const order of orders) {
      let orderProducts = order.products;
      // If products is a string, try to parse it
      if (typeof orderProducts === 'string') {
        try {
          orderProducts = JSON.parse(orderProducts);
        } catch (e) {
          orderProducts = [];
        }
      }
      if (Array.isArray(orderProducts)) {
        for (const prod of orderProducts) {
          // If prod is an object with productId, use productId as id
          if (prod && typeof prod === 'object' && (prod.id || prod.productId)) {
            products.push({
              id: prod.id || prod.productId,
              name: prod.name,
              orderNumber: order.orderId,
              returnTerm: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '',
              image: Array.isArray(prod.images) && prod.images.length > 0 ? prod.images[0] : (typeof prod.image === 'string' ? prod.image.replace(/\[|\]|"/g, '') : 'https://via.placeholder.com/80x60')
            });
          } else if (typeof prod === 'string' || typeof prod === 'number') {
            // If prod is just an ID, fetch product details from DB
            const productObj = await db.products.findByPk(prod);
            if (productObj) {
              products.push({
                id: productObj.id,
                name: productObj.name,
                orderNumber: order.orderId,
                returnTerm: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '',
                image: Array.isArray(productObj.images) && productObj.images.length > 0 ? productObj.images[0] : 'https://via.placeholder.com/80x60'
              });
            }
          }
        }
      }
    }
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

// GET /api/returns/categories - List top categories (mock)
router.get('/categories', (req, res) => {
  res.json({
    categories: [
      { name: 'Computers', icon: 'computer' },
      { name: 'Fashion', icon: 'fashion' },
      { name: 'Electronics', icon: 'electronics' },
      { name: 'Gaming', icon: 'gaming' },
      { name: 'TV/Projectors', icon: 'tv' },
      { name: 'Toys', icon: 'toys' },
      { name: 'Sport', icon: 'sport' },
      { name: 'Health', icon: 'health' },
      { name: 'Auto', icon: 'auto' },
      { name: 'Books', icon: 'books' },
      { name: 'Home', icon: 'home' },
      { name: 'Photo/Video', icon: 'photo' },
      { name: 'Collectibles', icon: 'collectibles' },
      { name: 'Beauty', icon: 'beauty' }
    ]
  });
});

// GET /api/returns/profile - Get user profile data (mock)
router.get('/profile', (req, res) => {
  res.json({
    user: {
      name: 'Jese Leos',
      email: 'youname@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      favoriteProducts: 455,
      totalOrders: 124,
      reviewsAdded: 1285,
      productReturns: 2,
      deliveryAddress: 'Miles Drive, Newark, NJ 07103, California, United States of America',
      phone: ['+1234 567 890', '+12 345 678'],
      country: 'United States of America',
      addresses: [
        {
          label: 'Preferred address',
          name: 'Bonnie Green',
          address: '92 Miles Drive, Newark, NJ 07103, California, United States of America'
        }
      ],
      cards: [
        {
          label: 'Favorite card',
          type: 'Visa',
          last4: '7858',
          expiry: '10/2024'
        }
      ]
    },
    activeOrders: [
      { id: '#FWB125467980', date: '27.01.2024', price: 4799, status: 'In transit' },
      { id: '#FWB125467971', date: '11.12.2023', price: 964, status: 'Pre-order' },
      { id: '#FWB125467865', date: '05.04.2023', price: 230, status: 'Confirmed' }
    ]
  });
});

// GET /api/returns/wishlist - List wishlist items for the current user (mock)
router.get('/wishlist', (req, res) => {
  res.json({
    wishlist: Array(8).fill({
      id: 'sony-ht-s20r',
      name: 'SONY HT-S20R 400W Bluetooth Home Theatre...',
      image: 'https://via.placeholder.com/80x60',
      price: 4756
    })
  });
});

// GET /api/returns/my-refunds - List refund requests for the current user (mock)
router.get('/my-refunds', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  
  // Only show refunds for products that have submitted return forms
  // If no forms have been submitted yet, return an empty array
  if (!global.submittedReturnForms || global.submittedReturnForms.length === 0) {
    return res.json({
      refunds: [],
      page: 1,
      totalPages: 0,
      total: 0
    });
  }
  
  res.json({
    refunds: [
      { id: '#FWB127364372', dueDate: '09 Jan 2024', reason: 'Damaged product', status: 'Ongoing' },
      { id: '#FWB125467980', dueDate: '12 Dec 2023', reason: 'Wrong delivery', status: 'Completed' },
      { id: '#FWB1339485607', dueDate: '19 Nov 2023', reason: 'Defective item', status: 'Completed' },
      { id: '#FWB137364371', dueDate: '23 Oct 2023', reason: 'Missing parts', status: 'Completed' },
      { id: '#FWB148273645', dueDate: '20 Sep 2023', reason: 'Change of mind', status: 'Denied' },
      { id: '#FWB146284623', dueDate: '30 Aug 2023', reason: 'Color mismatch', status: 'Completed' },
      { id: '#FWB145967376', dueDate: '09 Aug 2023', reason: 'Product malfunction', status: 'Completed' },
      { id: '#FWB148756352', dueDate: '05 Jun 2023', reason: 'Defective item', status: 'Denied' },
      { id: '#FWB159873546', dueDate: '31 Jun 2023', reason: 'Price too high', status: 'Completed' },
      { id: '#FWB156475937', dueDate: '24 Jun 2023', reason: 'Missing parts', status: 'Completed' }
    ],
    page: 3,
    totalPages: 100,
    total: 1000
  });
});

// GET /api/returns/refund-status/:orderId - Get refund status for an order (mock)
// GET /api/returns/refund-status/:orderId - Get refund status for an order (DB)
router.get('/refund-status/:orderId', async (req, res) => {
  const { orderId } = req.params;
  try {
    // Find the return record for this order
    const returnRecord = await db.returns.findOne({ where: { orderId } });
    if (!returnRecord) {
      return res.status(404).json({
        error: "No return form found for this order",
        message: "You need to fill out a return form before viewing the refund status"
      });
    }

    // You can expand this with more real data as needed
        res.json({
          orderId,
          status: returnRecord.status,
          reason: returnRecord.reason,
          productId: returnRecord.productId,
          createdAt: returnRecord.createdAt,
          // Mock timeline steps for frontend RefundTimeline
          timeline: [
            {
              icon: 'Package',
              title: 'Return Requested',
              date: new Date(returnRecord.createdAt).toLocaleDateString(),
              description: 'You requested a return for this product.',
              status: 'completed'
            },
            {
              icon: 'Truck',
              title: 'Product Picked Up',
              date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
              description: 'Courier picked up your product.',
              status: 'completed'
            },
            {
              icon: 'DollarSign',
              title: 'Refund Processed',
              date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString(),
              description: 'Your refund is being processed.',
              status: returnRecord.status === 'completed' ? 'completed' : 'current'
            }
          ],
          // Mock details for frontend RefundDetails
          details: {
            reason: returnRecord.reason || 'No reason provided',
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            packageCondition: 'Intact',
            info: 'Refund will be credited within 3-5 business days.'
          },
          refundAmount: 4999,
          refundMethod: {
            type: 'Bank Transfer',
            info: 'Funds will be transferred to your registered bank account.'
          }
        });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/returns/confirm - Confirm product return request (mock)
router.post('/confirm', authMiddleware, (req, res) => {
  // Get the submitted products from the request body
  const { selectedProducts, reason } = req.body;
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!selectedProducts || selectedProducts.length === 0) {
    return res.status(400).json({ error: 'No products selected' });
  }
  // For each product, create a return record
  Promise.all(selectedProducts.map(async (productId) => {
    // You may want to get orderId from the product/order context
    // For now, assume productId is enough
    await db.returns.create({
      customerId: userId,
      orderId: productId, // If you have actual orderId, use it here
      productId,
      reason: reason || '',
      status: 'pending',
      createdAt: new Date(),
    });
  })).then(() => {
    res.status(201).json({
      message: 'Your return request has been successfully registered',
      status: 'success',
      info: 'You can track the status of your order until the case is resolved.',
      orderId: selectedProducts[0]
    });
  }).catch((err) => {
    res.status(500).json({ error: err.message });
  });
});

// GET /api/returns/refund-options - List refund options for product return (mock)
router.get('/refund-options', (req, res) => {
  res.json({
    options: [
      {
        id: 'voucher',
        label: 'I want a Shopping Voucher',
        description: 'Receive an instant voucher that you can use for new orders.'
      },
      {
        id: 'money',
        label: 'I want my money back',
        description: 'We will transfer the money to your account. This can take up to 5 days.'
      },
      {
        id: 'replace',
        label: 'I want another product',
        description: 'We will replace your product with a new one or one close to the one you returned.'
      }
    ]
  });
});

// GET /api/returns/delivery-options - List delivery options for product return (mock)
router.get('/delivery-options', (req, res) => {
  res.json({
    options: [
      {
        id: 'express',
        name: 'Express courier',
        price: 19,
        provider: 'FedEx',
        eta: 'by Tomorrow',
        description: 'Send it by Tomorrow'
      },
      {
        id: 'pickup',
        name: 'Store pickup',
        price: 0,
        provider: null,
        eta: 'by Today',
        description: 'Send it by Today'
      },
      {
        id: 'flowbox',
        name: 'Flowbox',
        price: 29,
        provider: 'Flowbox',
        eta: 'by 2 Jan 2024',
        description: 'Send it by 2 Jan 2024'
      }
    ]
  });
});

// POST /api/returns/reasons - Submit product return reason (mock)
router.post('/reasons', (req, res) => {
  const { productId, orderNumber, condition, mainReasons, otherCondition, otherReason } = req.body;
  // In real implementation, validate and save to DB
  // For now, return mock success response
  res.status(201).json({
    message: 'Return reason submitted successfully',
    data: {
      productId,
      orderNumber,
      condition,
      mainReasons,
      otherCondition: otherCondition || null,
      otherReason: otherReason || null
    }
  });
});
