// Script to list all users and customers in the database
import db from '../admin/db.js';

async function listUsersAndCustomers() {
  try {
    const users = await db.user.findAll();
    const customers = await db.customers.findAll();
    console.log('--- USERS ---');
    users.forEach(u => {
      console.log({ id: u.id, name: u.name, email: u.email, phone: u.phone });
    });
    console.log('\n--- CUSTOMERS ---');
    customers.forEach(c => {
      console.log({ id: c.id, name: c.name, email: c.email, phone: c.phone, isGuest: c.isGuest, userId: c.userId });
    });
    process.exit(0);
  } catch (err) {
    console.error('Error listing users/customers:', err);
    process.exit(1);
  }
}

listUsersAndCustomers();
