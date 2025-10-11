import express from "express";
import db from "../admin/db.js";
import { authenticateToken } from "../../main/auth.js";
const router = express.Router();

// Debug endpoint to check order creation and retrieval
router.get("/debug/orders", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;
    
    console.log(`Debug request from user: ${userId}, email: ${userEmail}`);
    
    // 1. Check if customer exists
    const customer = await db.customers.findOne({ 
      where: { email: userEmail } 
    });
    
    // 2. Get all orders for this customer
    let orders = [];
    if (customer) {
      orders = await db.orders.findAll({
        where: { customerId: customer.id },
        include: [
          {
            model: db.customers,
            as: "customer",
            attributes: ['name', 'email']
          }
        ],
        order: [['createdAt', 'DESC']]
      });
    }
    
    // 3. Get recent orders (for comparison)
    const recentOrders = await db.orders.findAll({
      limit: 5,
      include: [
        {
          model: db.customers,
          as: "customer",
          attributes: ['name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    const debugInfo = {
      user: {
        id: userId,
        email: userEmail
      },
      customer: customer ? {
        id: customer.id,
        name: customer.name,
        email: customer.email
      } : null,
      userOrders: orders.map(order => ({
        orderId: order.orderId,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt
      })),
      recentOrders: recentOrders.map(order => ({
        orderId: order.orderId,
        customerEmail: order.customer?.email,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt
      })),
      summary: {
        customerFound: !!customer,
        userOrderCount: orders.length,
        totalOrdersInDB: await db.orders.count()
      }
    };
    
    res.json(debugInfo);
    
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({ 
      error: "Debug failed", 
      details: error.message 
    });
  }
});

export default router;
