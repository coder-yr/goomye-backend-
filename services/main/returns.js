import express from "express";
const router = express.Router();

// GET /api/returns/products - List products eligible for return (mock)
router.get('/products', (req, res) => {
  res.json({
    products: [
      {
        id: '1',
        name: 'PC system All in One APPLE iMac (2023) mrq3r3r/a, Apple M3, 24" Retina 4.5K, 8GB, SSD 256GB, 10-core GPU',
        orderNumber: '#737423642',
        returnTerm: '21.07.2023',
        image: 'https://via.placeholder.com/80x60'
      },
      {
        id: '2',
        name: 'Restored Apple Watch Series 8 (GPS) 41mm Midnight Aluminum Case with Midnight Sport Band',
        orderNumber: '#45632736',
        returnTerm: '26.07.2023',
        image: 'https://via.placeholder.com/80x60'
      },
      {
        id: '3',
        name: 'Sony Playstation 5 Digital Edition Console with Extra Blue Controller, and White PULSE 3D Headset',
        orderNumber: '#54628495',
        returnTerm: '24.07.2023',
        image: 'https://via.placeholder.com/80x60'
      },
      {
        id: '4',
        name: 'APPLE iPhone 15 5G phone, 256GB, Gold',
        orderNumber: '#64534294',
        returnTerm: '26.07.2023',
        image: 'https://via.placeholder.com/80x60'
      },
      {
        id: '5',
        name: 'Xbox Series X Diablo IV Bundle + Xbox Wireless Controller Carbon Black + Dual Controller Charge Docker',
        orderNumber: '#98475625',
        returnTerm: '21.07.2023',
        image: 'https://via.placeholder.com/80x60'
      }
    ]
  });
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
router.get('/refund-status/:orderId', (req, res) => {
  const { orderId } = req.params;
  res.json({
    orderId,
    timeline: [
      {
        label: 'Order placed',
        date: '12 September 2024 at 10:45'
      },
      {
        label: 'Refund accepted',
        date: '13 September 2024 at 12:07'
      },
      {
        label: 'Pick up product from the address',
        date: '16-17 September 2024',
        note: 'Estimated time will be 2-3 business days.'
      },
      {
        label: 'Products in the courier’s warehouse',
        date: '20 September 2024',
        note: 'The products have arrived at the courier’s headquarters and are ready to be shipped to the seller.'
      },
      {
        label: 'Product check',
        date: '22 September 2024',
        note: 'We will carefully check the product and inform you as soon as possible if you are eligible for a refund.'
      },
      {
        label: 'Refund the amount',
        date: '22 September 2024',
        note: 'We will return the amount depending on the option chosen.'
      }
    ],
    details: {
      refundReason: 'The product received is broken, malfunctioning, or damaged, making it unusable.',
      dueDate: '12 September 2024',
      packageCondition: 'I want to return a non-functional but unsealed product.'
    },
    refundAmount: 7191.00,
    refundMethod: {
      type: 'Bank transfer refund',
      description: 'The refund is processed by transferring the funds directly to your bank account.',
      note: 'Refunds may take up to 3 - 4 additional business days to reflect in your bank account from the date of initiating it.'
    }
  });
});

// POST /api/returns/confirm - Confirm product return request (mock)
router.post('/confirm', (req, res) => {
  // In real implementation, process and save the return request
  // For now, return mock confirmation
  res.status(201).json({
    message: 'Your request has been successfully registered',
    status: 'success',
    info: 'You can track the status of your order until the case is resolved.'
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
