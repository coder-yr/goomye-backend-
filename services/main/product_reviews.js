import express from "express";
const router = express.Router();

// GET /api/products/:productId/reviews - Product reviews (mock)
router.get("/:productId/reviews", (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 5 } = req.query;

  // Mock review stats
  const stats = {
    average: 4.65,
    count: 645,
    breakdown: {
      5: 239,
      4: 432,
      3: 53,
      2: 32,
      1: 13
    }
  };

  // Mock reviews
  const reviews = [
    {
      id: 1,
      user: "Michael Gough",
      rating: 5,
      date: "November 18 2023 at 15:35",
      verified: true,
      text: "My old IMAC was from 2013. This replacement was well needed. Very fast, and the colour matches my office set up perfectly. The display is out of this world and I'm very happy with this purchase.",
      helpfulYes: 3,
      helpfulNo: 0
    },
    {
      id: 2,
      user: "Jese Leos",
      rating: 5,
      date: "November 18 2023 at 15:35",
      verified: true,
      text: "It's fancy, amazing keyboard, matching accessories. Super fast, batteries last more than usual, everything runs perfect in this computer. Highly recommend!",
      image: "https://via.placeholder.com/100",
      helpfulYes: 1,
      helpfulNo: 0
    },
    {
      id: 3,
      user: "Bonnie Green",
      rating: 5,
      date: "November 18 2023 at 15:35",
      verified: true,
      text: "My old IMAC was from 2013. This replacement was well needed. Very fast, and the colour matches my office set up perfectly. The display is out of this world and I'm very happy with this purchase.",
      helpfulYes: 0,
      helpfulNo: 0
    },
    {
      id: 4,
      user: "Roberta Casas",
      rating: 5,
      date: "November 18 2023 at 15:35",
      verified: true,
      text: "I have used earlier Mac computers in my university work for a number of years and found them easy to use. The iMac 2021 is no exception. It works straight out of the box giving superb definition from the HD screen. Basic tools such as a browser (Safari) and a mail client are included in the system. Microsoft Office apps can be downloaded from the App Store though they may only work in read-only mode unless you take out a subscription. The instruction manual that comes with it is the size of a piece of toilet paper but the proper user guide is on-line.",
      helpfulYes: 1,
      helpfulNo: 0
    },
    {
      id: 5,
      user: "Neil Sims",
      rating: 4,
      date: "November 18 2023 at 15:35",
      verified: true,
      text: "I replaced my 11 year old iMac with the new M1 Apple. I wanted to remain with Apple as my old one is still working perfectly and all Apple products are so reliable. Setting up was simple and fast and transferring everything from my previous iMac worked perfectly.",
      helpfulYes: 1,
      helpfulNo: 0
    }
  ];

  res.json({
    productId,
    stats,
    reviews,
    page: Number(page),
    limit: Number(limit),
    total: stats.count
  });
});

export default router;

// GET /api/products/:productId - Product detail page (mock)
router.get('/:productId', (req, res) => {
  const { productId } = req.params;
  // Mock product details for Apple iMac 24" M1
  if (productId === 'imac-m1') {
    return res.json({
      id: 'imac-m1',
      name: 'Apple iMac 24" All-in-One Computer, Apple M1, 8GB RAM, 512GB SSD',
      images: [
        'https://via.placeholder.com/300x200',
        'https://via.placeholder.com/100x100',
        'https://via.placeholder.com/100x100'
      ],
      price: 1249.99,
      oldPrice: 1399.99,
      rating: 4.9,
      reviews: 3200,
      inStock: true,
      colors: ['#fff', '#000', '#f0f0f0', '#e0e0e0'],
      description: 'The Apple iMac 24" (2023) with Apple M1 chip delivers blazing-fast performance and a stunning 4.5K Retina display. Perfect for creative professionals and everyday users alike.',
      details: {
        display: '24" Retina 4.5K',
        processor: 'Apple M1',
        ram: '8GB',
        storage: '512GB SSD'
      },
      overview: 'The Apple iMac 24" (2023) is powered by the Apple M1 chip, offering incredible speed and efficiency. The 4.5K Retina display provides vibrant colors and sharp details. With 8GB RAM and 512GB SSD, multitasking and storage are a breeze. Sleek design, multiple color options, and advanced connectivity make it a top choice for home and office.',
      specifications: [
        { label: 'Display', value: '24" Retina 4.5K' },
        { label: 'Processor', value: 'Apple M1' },
        { label: 'RAM memory', value: '8GB' },
        { label: 'Storage', value: '512GB SSD' }
      ],
      warranty: '1 year',
      related: [
        {
          id: 'nokia-gseries',
          name: 'Nokia Gseries G110 5G',
          image: 'https://via.placeholder.com/120x120',
          price: 499
        },
        {
          id: 'iphone-15',
          name: 'Apple iPhone 15 Pro Max',
          image: 'https://via.placeholder.com/120x120',
          price: 1299
        },
        {
          id: 'mac-air',
          name: 'Mac Air 15" (2021)',
          image: 'https://via.placeholder.com/120x120',
          price: 1099
        }
      ]
    });
  }
  // Default mock for other products
  res.json({
    id: productId,
    name: 'Sample Product',
    images: ['https://via.placeholder.com/300x200'],
    price: 999.99,
    oldPrice: 1099.99,
    rating: 4.5,
    reviews: 100,
    inStock: true,
    colors: ['#fff', '#000'],
    description: 'Sample product description.',
    details: {},
    overview: '',
    specifications: [],
    warranty: '',
    related: []
  });
});

// GET /api/products/list - Paginated product listing (mock)
router.get('/list', (req, res) => {
  res.json({
    products: [
      {
        id: 'imac-m1',
        name: 'Apple iMac 24" M1',
        image: 'https://via.placeholder.com/120x120',
        price: 1199,
        colors: ['#fff', '#000', '#f0f0f0', '#e0e0e0'],
        inStock: true
      },
      {
        id: 'ps5',
        name: 'PlayStation 5 Console',
        image: 'https://via.placeholder.com/120x120',
        price: 499,
        colors: ['#fff', '#000'],
        inStock: true
      },
      {
        id: 'ipad-pro',
        name: 'iPad Pro 12.9" 2021 WiFi 128GB',
        image: 'https://via.placeholder.com/120x120',
        price: 1199,
        colors: ['#fff', '#000', '#e0e0e0'],
        inStock: true
      },
      {
        id: 'nokia-gseries',
        name: 'Nokia Gseries G110 5G',
        image: 'https://via.placeholder.com/120x120',
        price: 499,
        colors: ['#fff', '#000'],
        inStock: true
      },
      {
        id: 'iphone-15',
        name: 'Apple iPhone 15 Pro Max',
        image: 'https://via.placeholder.com/120x120',
        price: 1299,
        colors: ['#fff', '#000', '#f0f0f0'],
        inStock: true
      },
      {
        id: 'mac-air',
        name: 'Mac Air 15" (2021)',
        image: 'https://via.placeholder.com/120x120',
        price: 1099,
        colors: ['#fff', '#000', '#e0e0e0'],
        inStock: true
      }
    ],
    page: 1,
    totalPages: 10,
    total: 60,
    filters: {
      categories: ['Electronics', 'Computers', 'Gaming', 'Phones', 'Tablets'],
      brands: ['Apple', 'Sony', 'Nokia'],
      colors: ['#fff', '#000', '#f0f0f0', '#e0e0e0'],
      priceRange: [499, 1299]
    }
  });
});

// GET /api/products - List products for landing page (mock)
router.get('/', (req, res) => {
  res.json({
    products: [
      {
        id: 'sony-ht-s20r',
        name: 'SONY HT-S20R 400W Bluetooth Home Theatre...',
        image: 'https://via.placeholder.com/120x120',
        price: 9890,
        oldPrice: 12990,
        rating: 4.8,
        reviews: 1200
      },
      {
        id: 'lenovo-lq-15k3q',
        name: 'Lenovo LQJ 15K3Q Intel Core i7 14th Gen Gaming...',
        image: 'https://via.placeholder.com/120x120',
        price: 72990,
        oldPrice: 89990,
        rating: 4.6,
        reviews: 900
      },
      {
        id: 'coros-vertix',
        name: 'Coros Vertix 2 Adventure GPS Smartwatch',
        image: 'https://via.placeholder.com/120x120',
        price: 49990,
        oldPrice: 59990,
        rating: 4.7,
        reviews: 800
      },
      {
        id: 'lg-fridge',
        name: 'LG 4.8 Star Inverter Fully Automatic Top Load...',
        image: 'https://via.placeholder.com/120x120',
        price: 24990,
        oldPrice: 29990,
        rating: 4.5,
        reviews: 600
      }
    ]
  });
});


// GET /api/products/my - List reviews written by the current user (mock)
router.get('/my', (req, res) => {
  // In real implementation, use req.user.id from auth middleware
  // For now, return mock reviews
  res.json({
    reviews: [
      {
        id: 101,
        product: {
          id: '1',
          name: 'Apple iMac 27", 1TB HDD, Retina 5K',
          image: 'https://via.placeholder.com/80x60',
        },
        rating: 5,
        date: '2024-04-12',
        title: 'Masterpiece in design',
        description: 'The iMac is a masterpiece in terms of design. It’s incredibly sleek and thin, fitting perfectly on my desk without taking up much space. The selection of vibrant colors is a nice touch; I opted for the blue model, which looks stunning.',
        recommend: true
      },
      {
        id: 102,
        product: {
          id: '2',
          name: 'Brother MFC-J1DW Inkjet',
          image: 'https://via.placeholder.com/80x60',
        },
        rating: 3,
        date: '2024-03-08',
        title: 'Frustrating experience',
        description: 'The inkjet printer has been a frustrating experience. Print quality is inconsistent, with colors often.',
        recommend: false
      },
      {
        id: 103,
        product: {
          id: '3',
          name: 'Sony Playstation 5 Digital Edition Console',
          image: 'https://via.placeholder.com/80x60',
        },
        rating: 5,
        date: '2024-01-19',
        title: 'Next-gen experience!',
        description: 'Stunning graphics, lightning-fast load times, and an impressive game library. The new controller’s haptic feedback adds a whole new level of immersion. Truly a next-gen experience!',
        recommend: true
      },
      {
        id: 104,
        product: {
          id: '4',
          name: 'APPLE iPhone 15 5G phone, 256GB, Gold',
          image: 'https://via.placeholder.com/80x60',
        },
        rating: 4,
        date: '2023-10-11',
        title: 'Great upgrade',
        description: 'Sleek design, stunning display, and exceptional camera quality. Battery life could be better, and it’s a bit pricey, but overall, a great upgrade!',
        recommend: true
      },
      {
        id: 105,
        product: {
          id: '5',
          name: 'Microsoft Surface Pro, Copilot+ PC, 13 Inch',
          image: 'https://via.placeholder.com/80x60',
        },
        rating: 5,
        date: '2023-07-27',
        title: 'Premium build quality',
        description: 'The build quality is excellent, with a solid aluminum body that feels very premium.',
        recommend: true
      }
    ],
    page: 3,
    totalPages: 100,
    total: 500
  });
});

// POST /api/products/:productId/reviews - Add a new review for a product
router.post('/:productId/reviews', (req, res) => {
  const { rating, title, description, images, recommend } = req.body;
  // In real implementation, validate and save to DB
  // For now, return mock success response
  res.status(201).json({
    message: 'Review submitted successfully',
    review: {
      id: Math.floor(Math.random() * 10000),
      productId: req.params.productId,
      rating,
      title,
      description,
      images: images || [],
      recommend,
      reviewer: 'Anonymous',
      date: new Date().toISOString().slice(0, 10)
    }
  });
});
