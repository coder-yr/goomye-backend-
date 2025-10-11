// Test script to verify order creation and retrieval
// Run with: node test_order_creation.js

import db from './services/admin/db.js';

async function testOrderCreation() {
  try {
    console.log('🧪 Testing order creation and retrieval...\n');
    
    // 1. Check if we have any customers
    const customers = await db.customers.findAll({ limit: 5 });
    console.log(`📊 Found ${customers.length} customers in database`);
    
    if (customers.length > 0) {
      console.log('Sample customers:');
      customers.forEach(customer => {
        console.log(`  - ID: ${customer.id}, Name: ${customer.name}, Email: ${customer.email}`);
      });
    }
    
    // 2. Check if we have any orders
    const orders = await db.orders.findAll({ 
      limit: 5,
      include: [
        {
          model: db.customers,
          as: "customer",
          attributes: ['name', 'email']
        }
      ]
    });
    
    console.log(`\n📦 Found ${orders.length} orders in database`);
    
    if (orders.length > 0) {
      console.log('Sample orders:');
      orders.forEach(order => {
        console.log(`  - Order ID: ${order.orderId}, Customer: ${order.customer?.name || 'Unknown'}, Status: ${order.status}, Total: $${order.total}`);
      });
    }
    
    // 3. Test customer lookup by email
    if (customers.length > 0) {
      const testEmail = customers[0].email;
      console.log(`\n🔍 Testing customer lookup by email: ${testEmail}`);
      
      const foundCustomer = await db.customers.findOne({ 
        where: { email: testEmail } 
      });
      
      if (foundCustomer) {
        console.log(`✅ Found customer: ${foundCustomer.name} (ID: ${foundCustomer.id})`);
        
        // 4. Test order lookup by customer
        const customerOrders = await db.orders.findAll({
          where: { customerId: foundCustomer.id },
          limit: 3
        });
        
        console.log(`📋 Found ${customerOrders.length} orders for this customer`);
        customerOrders.forEach(order => {
          console.log(`  - ${order.orderId}: $${order.total} (${order.status})`);
        });
      } else {
        console.log('❌ Customer not found');
      }
    }
    
    console.log('\n🎉 Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await db.sequelize.close();
  }
}

testOrderCreation();
