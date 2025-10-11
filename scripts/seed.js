import db from '../services/admin/db.js';

async function seed() {
  try {
    await db.sequelize.sync({ force: true });


    // Mega categories to seed
    const megaCategoriesData = [
      { name: 'General', image: 'https://via.placeholder.com/150', slug: 'general' },
      { name: 'Electronics', image: 'https://via.placeholder.com/150', slug: 'electronics' },
      { name: 'Computer & Office', image: 'https://via.placeholder.com/150', slug: 'computer-office' },
      { name: 'Fashion/Clothes', image: 'https://via.placeholder.com/150', slug: 'fashion-clothes' },
      { name: 'Gaming/Consoles', image: 'https://via.placeholder.com/150', slug: 'gaming-consoles' },
      { name: 'TV/Projectors', image: 'https://via.placeholder.com/150', slug: 'tv-projectors' },
      { name: 'Collectibles & Toys', image: 'https://via.placeholder.com/150', slug: 'collectibles-toys' },
      { name: 'Sports & Outdoors', image: 'https://via.placeholder.com/150', slug: 'sports-outdoors' },
      { name: 'Food & Grocery', image: 'https://via.placeholder.com/150', slug: 'food-grocery' },
      { name: 'Health & Beauty', image: 'https://via.placeholder.com/150', slug: 'health-beauty' },
      { name: 'Car & Motorbike', image: 'https://via.placeholder.com/150', slug: 'car-motorbike' },
      { name: 'Books', image: 'https://via.placeholder.com/150', slug: 'books' },
      { name: 'Home Air Quality', image: 'https://via.placeholder.com/150', slug: 'home-air-quality' },
      { name: 'Photo/Video', image: 'https://via.placeholder.com/150', slug: 'photo-video' }
    ];

    // Create all mega categories
    const megaCategories = await db.megaCategory.bulkCreate(
      megaCategoriesData.map(m => ({ ...m, createdAt: new Date(), updatedAt: new Date() }))
    );

    // Categories to seed for each mega category
    const categoriesByMega = {
      'General': [
        { name: 'Computers', icon: 'Monitor' },
        { name: 'Fashion', icon: 'ShoppingBag' },
        { name: 'Electronics', icon: 'Tv' },
        { name: 'Gaming', icon: 'Headphones' },
        { name: 'Toys', icon: 'Puzzle' }
      ],
      'Electronics': [
        { name: 'Mobiles', icon: 'Smartphone' },
        { name: 'Audio Devices', icon: 'Headphones' },
        { name: 'Cameras', icon: 'Camera' }
      ],
      'Computer & Office': [
        { name: 'Desktops', icon: 'Monitor' },
        { name: 'Laptops', icon: 'Laptop' },
        { name: 'Computer Accessories', icon: 'Keyboard' }
      ],
      'Fashion/Clothes': [
        { name: 'Men Clothing', icon: 'User' },
        { name: 'Women Clothing', icon: 'User' },
        { name: 'Kids Clothing', icon: 'User' }
      ],
      'Gaming/Consoles': [
        { name: 'Consoles', icon: 'Gamepad' },
        { name: 'Games', icon: 'Gamepad' },
        { name: 'Gaming Accessories', icon: 'Gamepad' }
      ],
      'TV/Projectors': [
        { name: 'TVs', icon: 'Tv' },
        { name: 'Projectors', icon: 'Tv' }
      ],
      'Collectibles & Toys': [
        { name: 'Action Figures', icon: 'Puzzle' },
        { name: 'Board Games', icon: 'Puzzle' },
        { name: 'Educational Toys', icon: 'Puzzle' }
      ],
      'Sports & Outdoors': [
        { name: 'Fitness Gear', icon: 'Smile' },
        { name: 'Outdoor Equipment', icon: 'Smile' }
      ],
      'Food & Grocery': [
        { name: 'Beverages', icon: 'CupSoda' },
        { name: 'Snacks', icon: 'CupSoda' }
      ],
      'Health & Beauty': [
        { name: 'Personal Care', icon: 'Heart' },
        { name: 'Health Devices', icon: 'Heart' }
      ],
      'Car & Motorbike': [
        { name: 'Accessories', icon: 'Truck' },
        { name: 'Parts', icon: 'Truck' }
      ],
      'Books': [
        { name: 'Genres', icon: 'BookOpen' },
        { name: 'Formats', icon: 'BookOpen' }
      ],
      'Home Air Quality': [
        { name: 'Devices', icon: 'Sparkles' }
      ],
      'Photo/Video': [
        { name: 'Cameras', icon: 'Camera' },
        { name: 'Accessories', icon: 'Camera' }
      ]
    };

    // Create categories for each mega category
    let allCategories = [];
    for (const mega of megaCategories) {
      const cats = categoriesByMega[mega.name] || [];
      const createdCats = await db.category.bulkCreate(
        cats.map(c => ({
          name: c.name,
          slug: `${mega.slug}-${c.name.toLowerCase().replace(/\s+/g, '-')}`,
          megaCategoryId: mega.id,
          icon: c.icon,
          featured: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      );
      allCategories = allCategories.concat(createdCats);
    }

    // Subcategories to seed for each category
    const subCategoriesByCategory = {
      'Computers': ['Computers Subcategory', 'Computers General', 'Desktops', 'Laptops', 'Computer Accessories'],
      'Fashion': ['Fashion General', 'Men Clothing', 'Women Clothing', 'Kids Clothing'],
      'Electronics': ['Electronics Subcategory', 'Electronics General', 'Mobiles', 'Audio Devices', 'Cameras'],
      'Gaming': ['Gaming Subcategory', 'Gaming General', 'Consoles', 'Games', 'Gaming Accessories'],
      'Toys': ['Toys General', 'Action Figures', 'Board Games', 'Educational Toys'],
      'Mobiles': ['Android', 'iPhone', 'Accessories'],
      'Audio Devices': ['Speakers', 'Headphones', 'Earbuds'],
      'Cameras': ['DSLR', 'Mirrorless', 'Action'],
      'Desktops': ['Gaming PC', 'Home Office', 'Servers', 'Mini PC', 'All in One PC'],
      'Laptops': ['Gaming', '2 in 1', 'Business', 'Home Office', 'Ultrabook'],
      'Computer Accessories': ['Keyboard', 'Mouse', 'Monitor', 'Printer'],
      'Men Clothing': ['Shirts', 'Jeans', 'Shoes', 'Jackets'],
      'Women Clothing': ['Dresses', 'Tops', 'Handbags', 'Jewelry'],
      'Kids Clothing': ['T-Shirts', 'Shorts', 'Toys'],
      'Consoles': ['PlayStation', 'Xbox', 'Nintendo Switch'],
      'Games': ['Action', 'Sports', 'Adventure', 'RPG'],
      'Gaming Accessories': ['Controllers', 'Headsets', 'Charging Docks'],
      'TVs': ['LED', 'OLED', 'Smart TVs'],
      'Projectors': ['Home Cinema', 'Portable', '4K'],
      'Action Figures': ['Marvel', 'DC', 'Anime'],
      'Board Games': ['Strategy', 'Family', 'Party'],
      'Educational Toys': ['STEM', 'Learning', 'Building'],
      'Fitness Gear': ['Yoga Mats', 'Weights', 'Resistance Bands'],
      'Outdoor Equipment': ['Tents', 'Backpacks', 'Sleeping Bags'],
      'Beverages': ['Coffee', 'Tea', 'Juices'],
      'Snacks': ['Chips', 'Cookies', 'Nuts'],
      'Personal Care': ['Skincare', 'Haircare', 'Fragrances'],
      'Health Devices': ['BP Monitors', 'Thermometers'],
      'Accessories': ['Covers', 'Seat Cushions', 'Cameras'],
      'Parts': ['Engine Oil', 'Filters', 'Batteries'],
      'Genres': ['Fiction', 'Non-fiction', 'Academic'],
      'Formats': ['Paperback', 'Hardcover', 'Ebook'],
      'Devices': ['Purifiers', 'Humidifiers', 'Dehumidifiers'],
      'Accessories': ['Tripods', 'Lenses', 'Bags']
    };

    // Create subcategories for each category
    for (const cat of allCategories) {
      const subs = subCategoriesByCategory[cat.name] || [`${cat.name} General`];
      await db.subCategory.bulkCreate(
        subs.map(sub => ({
          name: sub,
          image: 'https://via.placeholder.com/150',
          slug: `${cat.slug}-${sub.toLowerCase().replace(/\s+/g, '-')}`,
          categoryId: cat.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      );
    }


    // Find reference categories from allCategories
    const computersCategory = allCategories.find(c => c.name === 'Computers');
    const gamingCategory = allCategories.find(c => c.name === 'Gaming');
    const electronicsCategory = allCategories.find(c => c.name === 'Electronics');

    // Only create extra subcategories if categories exist
    if (computersCategory && gamingCategory && electronicsCategory) {
      await db.subCategory.bulkCreate([
        {
          name: 'Computers Subcategory',
          image: 'https://via.placeholder.com/150',
          slug: `${computersCategory.slug}-computers-subcategory`,
          categoryId: computersCategory.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Gaming Subcategory',
          image: 'https://via.placeholder.com/150',
          slug: `${gamingCategory.slug}-gaming-subcategory`,
          categoryId: gamingCategory.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Electronics Subcategory',
          image: 'https://via.placeholder.com/150',
          slug: `${electronicsCategory.slug}-electronics-subcategory`,
          categoryId: electronicsCategory.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ]);
    }


    // Demo products

  // Find the correct mega category for Electronics
  const electronicsMegaCategory = megaCategories.find(m => m.name === 'Electronics') || megaCategories[0];

  // Find the correct subcategory for Electronics
  // Use the slug for 'Mobiles' subcategory under Electronics
  const allSubCategories = await db.subCategory.findAll();
  const electronicsSubCategory = allSubCategories.find(sub => sub.slug === 'electronics-mobiles-android') || allSubCategories[0];

    const frontendProducts = [
      {
        name: "Apple iMac 27”",
        slug: "imac-27",
        price: 1199,
        images: JSON.stringify(["/apple-imac-27.jpg"]),
        youtubeUrl: "",
        shortcode: "IMAC27",
        colors: JSON.stringify(["#0f172a", "#e5e7eb", "#38bdf8", "#ec4899"]),
        categoryId: electronicsCategory.id,
        megaCategoryId: electronicsMegaCategory.id,
        subCategoryId: electronicsSubCategory.id,
        description: "Apple M3 Octa Core, 23.8inch, RAM 8GB, SSD 256GB, Apple M3 8‑Core, macOS Sonoma",
        trendingOrder: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "PlayStation 5 Slim Console",
        slug: "ps5-slim",
        price: 499,
        images: JSON.stringify(["/playstation-5-slim.png"]),
        youtubeUrl: "",
        shortcode: "PS5SLIM",
        colors: JSON.stringify(["#111827", "#6b7280", "#9ca3af"]),
        categoryId: electronicsCategory.id,
        megaCategoryId: electronicsMegaCategory.id,
        subCategoryId: electronicsSubCategory.id,
        description: "Up to 120fps with 120Hz output, 1TB HDD, 2 Controllers, Ray Tracing.",
        trendingOrder: 99,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "iPad Pro 13‑inch (M4): XDR Display",
        slug: "ipad-pro-13",
        price: 1199,
        images: JSON.stringify(["/ipad-pro-13.jpg"]),
        youtubeUrl: "",
        shortcode: "IPADPRO13",
        colors: JSON.stringify(["#111827", "#e5e7eb", "#34d399", "#60a5fa"]),
        categoryId: electronicsCategory.id,
        megaCategoryId: electronicsMegaCategory.id,
        subCategoryId: electronicsSubCategory.id,
        description: "Ultra Retina XDR Display, 256GB, Landscape 12MP Front Camera/12MP.",
        trendingOrder: 98,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Xbox Series S 1TB SSD",
        slug: "xbox-series-s-1tb",
        price: 499,
        images: JSON.stringify(["/xbox-series-s.jpg"]),
        youtubeUrl: "",
        shortcode: "XBOXS1TB",
        colors: JSON.stringify(["#111827", "#6b7280"]),
        categoryId: electronicsCategory.id,
        megaCategoryId: electronicsMegaCategory.id,
        subCategoryId: electronicsSubCategory.id,
        description: "All‑Digital Gaming Console 1440p Gaming 4K Streaming Carbon Black.",
        trendingOrder: 97,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Apple iPhone 15 Pro Max",
        slug: "iphone-15-pro-max",
        price: 1299,
        images: JSON.stringify(["/iphone-15-pro-max.png"]),
        youtubeUrl: "",
        shortcode: "IP15PMAX",
        colors: JSON.stringify(["#0f172a", "#fbbf24", "#38bdf8"]),
        categoryId: electronicsCategory.id,
        megaCategoryId: electronicsMegaCategory.id,
        subCategoryId: electronicsSubCategory.id,
        description: "256GB, Natural Titanium, 6.7 inches - Unlocked (Renewed).",
        trendingOrder: 96,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await db.products.bulkCreate(frontendProducts);

    // The following lines are commented out because the models are not defined in db.js:
    // await db.featuredCategory.bulkCreate([...]);
    // await db.collection.bulkCreate([...]);
    // await db.carousel.bulkCreate([...]);
    // await db.banner.bulkCreate([...]);
    // await db.unboxed.bulkCreate([...]);
    // await db.deal.bulkCreate([...]);
    // await db.user.create({...});
    // await db.wishlist.bulkCreate([...]);

    // --- Seed customers and related data ---
    const bcrypt = (await import('bcrypt')).default;
    const customers = await db.customers.bulkCreate([
      { name: 'Alice Smith', email: 'alice@example.com', password: await bcrypt.hash('password1', 10), phone: '1234567890', country: 'USA', whatsappUpdates: true },
      { name: 'Bob Lee', email: 'bob@example.com', password: await bcrypt.hash('password2', 10), phone: '2345678901', country: 'Canada', whatsappUpdates: true },
      { name: 'Charlie Kim', email: 'charlie@example.com', password: await bcrypt.hash('password3', 10), phone: '3456789012', country: 'UK', whatsappUpdates: false },
    ]);

    for (const customer of customers) {
      // First create address
      const address = await db.addresses.create({
        customerId: customer.id,
        line1: `${customer.id} Main St`,
        city: 'City',
        state: 'State',
        country: 'USA',
        zipcode: '12345',
        isHomeAddress: true
      });

      // Then create orders with addressId
      await db.orders.bulkCreate([
        {
          orderId: `ORD-${customer.id}-1`,
          customerId: customer.id,
          addressId: address.id,
          status: 'In Transist',
          products: JSON.stringify([{ id: 1, quantity: 1 }]),
          subTotal: 4799,
          discount: 0,
          total: 4799,
          taxes: JSON.stringify({ gst: 240 })
        },
        {
          orderId: `ORD-${customer.id}-2`,
          customerId: customer.id,
          addressId: address.id,
          status: 'Created',
          products: JSON.stringify([{ id: 2, quantity: 1 }]),
          subTotal: 964,
          discount: 0,
          total: 964,
          taxes: JSON.stringify({ gst: 48 })
        }
      ]);
      // Only create records for tables that exist in the database models
      // Note: cards, reviews, and returns tables are commented out as they're not yet defined
      // Once you add these models to db.js, uncomment the following code:
      
      /*
      // Card
      await db.cards.create({
        customerId: customer.id,
        last4: '1234',
        expiryMonth: '12',
        expiryYear: '2026',
        cardType: 'Visa',
        isDefault: true
      });
      
      // Review
      await db.reviews.create({
        customerId: customer.id,
        productId: 1,
        rating: 5,
        comment: 'Great product!'
      });
      
      // Return
      await db.returns.create({
        customerId: customer.id,
        orderId: 1,
        productId: 1,
        reason: 'Defective item',
        status: 'pending'
      });
      */
    }

    console.log('Database seeded successfully with user data!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed().catch((error) => {
  console.error('Failed to seed database:', error);
  process.exit(1);
});
