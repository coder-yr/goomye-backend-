// Migration to add userId and isGuest fields to customers table
// Run this with: node migrations/add_user_fields_to_customers.js

import db from './services/admin/db.js';

async function addUserFieldsToCustomers() {
  try {
    console.log('Adding userId and isGuest fields to customers table...');
    
    // Add userId field
    await db.sequelize.query(`
      ALTER TABLE customers 
      ADD COLUMN userId INT NULL COMMENT 'Reference to the authenticated user ID'
    `);
    console.log('✅ Added userId field');
    
    // Add isGuest field
    await db.sequelize.query(`
      ALTER TABLE customers 
      ADD COLUMN isGuest BOOLEAN NOT NULL DEFAULT FALSE
    `);
    console.log('✅ Added isGuest field');
    
    // Update existing customers to be guests
    await db.sequelize.query(`
      UPDATE customers 
      SET isGuest = TRUE 
      WHERE userId IS NULL
    `);
    console.log('✅ Updated existing customers to be guests');
    
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    
    // Check if columns already exist
    if (error.message.includes('Duplicate column name')) {
      console.log('ℹ️  Columns already exist, skipping migration');
    }
  } finally {
    await db.sequelize.close();
  }
}

addUserFieldsToCustomers();
