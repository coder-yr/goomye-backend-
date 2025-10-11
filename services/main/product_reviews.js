import express from "express";
import db from "../admin/db.js";
const router = express.Router();

// Function to seed initial data
async function seedInitialData() {
  const t = await db.sequelize.transaction();
  
  try {
    // First create the default mega category
    const [megaCategory] = await db.megaCategory.findOrCreate({
      where: { slug: 'electronics' },
      defaults: {
        name: 'Electronics',
        slug: 'electronics',
      },
      transaction: t
    });

    // Create sample categories if they don't exist
    const categories = [
      { name: "Computers", slug: "computers" },
      { name: "Fashion", slug: "fashion" },
      { name: "Mobiles", slug: "mobiles" },
      { name: "Gaming", slug: "gaming" },
      { name: "Beauty", slug: "beauty" },
      { name: "Home", slug: "home" },
      { name: "Sports", slug: "sports" },
      { name: "Health", slug: "health" },
      { name: "Auto", slug: "auto" },
      { name: "Books", slug: "books" },
      { name: "Home Audio", slug: "home-audio" },
      { name: "Cameras", slug: "cameras" },
      { name: "Grocery", slug: "grocery" },
      { name: "Electronics", slug: "electronics" },
      { name: "TV/Projectors", slug: "tv-projectors" },
      { name: "Toys", slug: "toys" },
      { name: "Photo/Video", slug: "photo-video" },
      { name: "Collectibles", slug: "collectibles" }
    ];

    for (const cat of categories) {
      const [category] = await db.category.findOrCreate({
        where: { slug: cat.slug },
        defaults: {
          name: cat.name,
          slug: cat.slug,
          megaCategoryId: megaCategory.id
        },
        transaction: t
      });

      // Create a default sub category if it doesn't exist
      const [subCategory] = await db.subCategory.findOrCreate({
        where: { slug: `${cat.slug}-general` },
        defaults: {
          name: `${cat.name} General`,
          slug: `${cat.slug}-general`,
          categoryId: category.id
        },
        transaction: t
      });

      // Add sample products for each category
      const products = [
        {
          name: `Sample ${cat.name} Product 1`,
          images: ['https://via.placeholder.com/300'],
          price: 999.99,
          mrp: 1299.99,
          discount: 23,
          slug: `sample-${cat.slug}-1`,
          description: `A great ${cat.name} product`,
          categoryId: category.id,
          megaCategoryId: megaCategory.id,
          subCategoryId: subCategory.id,
          youtubeUrl: "https://youtube.com",
          shortcode: `${cat.slug.toUpperCase()}-001`,
          trendingOrder: 1,
          listingOrder: 1,
          active: true
        },
        {
          name: `Sample ${cat.name} Product 2`,
          images: ['https://via.placeholder.com/300'],
          price: 1299.99,
          mrp: 1599.99,
          discount: 19,
          slug: `sample-${cat.slug}-2`,
          description: `Another amazing ${cat.name} product`,
          categoryId: category.id,
          megaCategoryId: megaCategory.id,
          subCategoryId: subCategory.id,
          youtubeUrl: "https://youtube.com",
          shortcode: `${cat.slug.toUpperCase()}-002`,
          trendingOrder: 2,
          listingOrder: 2,
          active: true
        }
      ];

      for (const product of products) {
        await db.products.findOrCreate({
          where: { slug: product.slug },
          defaults: product,
          transaction: t
        });
      }
    }

    await t.commit();
    console.log('Sample data seeded successfully');
  } catch (error) {
    await t.rollback();
    console.error('Error seeding data:', error);
  }
}

// Seed initial data when the server starts
seedInitialData().then(() => {
  console.log('Initial data seeding completed successfully');
}).catch(err => {
  console.error('Error seeding initial data:', err);
});

// GET /api/products/:productId/reviews - Product reviews (mock)
router.get("/:productId/reviews", async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 5 } = req.query;
  try {
    const pid = Number(productId);
    if (isNaN(pid)) {
      return res.status(400).json({ error: "Invalid productId" });
    }
    const offset = (Number(page) - 1) * Number(limit);
    const reviews = await db.reviews.findAll({
      where: { productId: pid },
      offset,
      limit: Number(limit),
      order: [["createdAt", "DESC"]]
    });
    // Calculate stats
    const allReviews = await db.reviews.findAll({ where: { productId: pid } });
    const count = allReviews.length;
    const average = count > 0 ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / count) : 0;
    const breakdown = {};
    for (let i = 1; i <= 5; i++) {
      breakdown[i] = allReviews.filter(r => r.rating === i).length;
    }
    res.json({
      productId: pid,
      stats: { average, count, breakdown },
      reviews,
      page: Number(page),
      limit: Number(limit),
      total: count
    });
  } catch (err) {
    console.error("Error fetching reviews for product", productId, err);
    res.status(500).json({ error: "Failed to fetch reviews", details: err.message });
  }
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
        image: '/apple-imac-27.jpg',
        price: 1199,
        colors: ['#fff', '#000', '#f0f0f0', '#e0e0e0'],
        inStock: true
      },
      {
        id: 'ps5',
        name: 'PlayStation 5 Console',
        image: '/playstation-5-slim.png',
        price: 499,
        colors: ['#fff', '#000'],
        inStock: true
      },
      {
        id: 'ipad-pro',
        name: 'iPad Pro 12.9" 2021 WiFi 128GB',
        image: '/ipad-pro-13.jpg',
        price: 1199,
        colors: ['#fff', '#000', '#e0e0e0'],
        inStock: true
      },
      {
        id: 'nokia-gseries',
        name: 'Nokia Gseries G110 5G',
        image: '/Tab.jpg',
        price: 499,
        colors: ['#fff', '#000'],
        inStock: true
      },
      {
        id: 'iphone-15',
        name: 'Apple iPhone 15 Pro Max',
        image: '/iphone-15-pro-max.png',
        price: 1299,
        colors: ['#fff', '#000', '#f0f0f0'],
        inStock: true
      },
      {
        id: 'mac-air',
        name: 'Mac Air 15" (2021)',
        image: '/apple-imac-27.jpg',
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
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    console.log('Requested category:', category);
    
    const where = {};
    if (category) {
      // Normalize the category slug
      const normalizedSlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      console.log('Normalized slug:', normalizedSlug);
      
      // Try to find category by slug or name
      const cat = await db.category.findOne({
        where: {
          [db.Sequelize.Op.or]: [
            { slug: normalizedSlug },
            { name: db.Sequelize.where(db.Sequelize.fn('LOWER', db.Sequelize.col('name')), normalizedSlug.replace(/-/g, ' ')) }
          ]
        },
        raw: true
      });
      console.log('Found category:', cat);
      
      if (cat) {
        where.categoryId = cat.id;
      } else {
        console.log('No category found for:', category);
        // No matching category, return empty
        return res.json({ products: [] });
      }
    }
    
    console.log('Query where clause:', where);
    const products = await db.products.findAll({ 
      where,
      attributes: ['id', 'name', 'images', 'price', 'slug', 'description', 'tagLine', 'youtubeUrl'],
      raw: true 
    });
    console.log('Found products:', products.length);

    // Transform the data for the frontend
    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price || 0,
      images: Array.isArray(product.images) ? product.images : [],
      description: product.description || '',
      tagLine: product.tagLine || '',
      youtubeUrl: product.youtubeUrl || ''
    }));

    res.json({ products: transformedProducts });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
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
router.post('/:productId/reviews', async (req, res) => {
  try {
    const { rating, title, description, images, recommend } = req.body;
    // You should get customerId from authentication middleware/session
    const customerId = req.user?.id || 1; // Replace with real user ID logic

    const review = await db.reviews.create({
      productId: req.params.productId,
      customerId,
      rating,
      comment: description,
      title,
      images: images || [],
      recommend,
    });

    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (err) {
    console.error('Error saving review:', err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// Trending products endpoint for frontend landing page
router.get('/api/products/trending', async (req, res) => {
  try {
    const products = await db.products.findAll({
      where: { trendingOrder: { [db.Sequelize.Op.gt]: 0 } },
      order: [['trendingOrder', 'ASC']],
      limit: 12
    });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trending products' });
  }
});

// Trending products endpoint for local frontend
router.get('/api/products/trending', async (req, res) => {
  try {
    const products = await db.products.findAll({
      where: { trendingOrder: { [db.Sequelize.Op.gt]: 0 } },
      order: [['trendingOrder', 'ASC']],
      limit: 12
    });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trending products' });
  }
});
