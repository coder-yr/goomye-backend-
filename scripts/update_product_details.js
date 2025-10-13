// Script to update productDetails for all products in the database
// Run with: node scripts/update_product_details.js

import db from '../services/admin/db.js';

const demoSpecs = [
  [
    {
      title: 'Display',
      items: [
        { label: 'Screen Type', value: 'light' },
        { label: 'Diagonal', value: '24 inches' },
        { label: 'Resolution', value: '4480 x 2520' },
        { label: 'Format', value: '4x' },
      ],
    },
    {
      title: 'Processor',
      items: [
        { label: 'Processor Type', value: 'Apple M3' },
        { label: 'Model', value: 'M3' },
        { label: 'Physical cores', value: '8' },
        { label: 'Virtual Cores', value: '16' },
        { label: 'Technology', value: '3nm' },
      ],
    },
    {
      title: 'RAM memory',
      items: [
        { label: 'Capacity', value: '8GB' },
        { label: 'Maximum memory', value: '64GB' },
      ],
    },
    {
      title: 'Storage',
      items: [
        { label: 'Capacity', value: '512GB' },
      ],
    },
  ],
  [
    {
      title: 'Display',
      items: [
        { label: 'Screen Type', value: 'OLED' },
        { label: 'Diagonal', value: '15.6 inches' },
        { label: 'Resolution', value: '3840 x 2160' },
        { label: 'Format', value: '16:9' },
      ],
    },
    {
      title: 'Processor',
      items: [
        { label: 'Processor Type', value: 'Intel i7' },
        { label: 'Model', value: '11700H' },
        { label: 'Physical cores', value: '8' },
        { label: 'Virtual Cores', value: '16' },
        { label: 'Technology', value: '10nm' },
      ],
    },
    {
      title: 'RAM memory',
      items: [
        { label: 'Capacity', value: '16GB' },
        { label: 'Maximum memory', value: '32GB' },
      ],
    },
    {
      title: 'Storage',
      items: [
        { label: 'Capacity', value: '1TB' },
      ],
    },
  ],
];

async function updateProductDetails() {
  const products = await db.products.findAll({ where: { active: true } });
  for (let i = 0; i < products.length; i++) {
    const specs = demoSpecs[i % demoSpecs.length]; // Assign different specs for demo
    await products[i].update({ productDetails: specs });
    console.log(`Updated product ${products[i].id} with new specs.`);
  }
  console.log('✅ All products updated with dynamic specs!');
}

updateProductDetails().then(() => process.exit(0));
