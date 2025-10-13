// Script to update description for all products in the database
// Run with: node scripts/update_product_descriptions.js

import db from '../services/admin/db.js';

const descriptions = [
  'This is a premium product with advanced features and high durability. Perfect for professionals and enthusiasts.',
  'Experience next-level performance and design. Ideal for everyday use and demanding tasks.',
  'A reliable and efficient product, combining style and functionality for modern users.',
  'Top-rated product with excellent reviews. Delivers outstanding value and satisfaction.',
];

async function updateProductDescriptions() {
  const products = await db.products.findAll({ where: { active: true } });
  for (let i = 0; i < products.length; i++) {
    const desc = descriptions[i % descriptions.length]; // Assign different descriptions for demo
    await products[i].update({ description: desc });
    console.log(`Updated product ${products[i].id} with new description.`);
  }
  console.log('✅ All products updated with new descriptions!');
}

updateProductDescriptions().then(() => process.exit(0));
