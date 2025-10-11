
import express from "express";
import db from "../admin/db.js";
import { authenticateToken } from "../../main/auth.js";
const router = express.Router();

// GET /api/orders - List orders for logged-in user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10, dateRange } = req.query;
    const userId = req.user.id;

    // Build where clause - find orders by customer's email
    // First find the customer record for this user by email
    const userEmail = req.user.email;
    const customer = await db.customers.findOne({ 
      where: { email: userEmail } 
    });
    
    if (!customer) {
      // No customer record found, return empty results
      return res.json({
        orders: [],
        page: parseInt(page),
        limit: parseInt(limit),
        total: 0,
        totalPages: 0,
        userId
      });
    }
    
    let whereClause = { customerId: customer.id };
    
    // Add status filter
    if (status && status !== "All") {
      whereClause.status = status;
    }

    // Add search filter
    if (search) {
      whereClause.orderId = {
        [db.Sequelize.Op.like]: `%${search}%`
      };
    }

    // Add date range filter
    if (dateRange) {
      const now = new Date();
      let startDate;
      
      switch (dateRange) {
        case 'Last 7 days':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'Last 30 days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'Last 6 months':
          startDate = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        whereClause.createdAt = {
          [db.Sequelize.Op.gte]: startDate
        };
      }
    }

    // Get total count for pagination
    const total = await db.orders.count({ where: whereClause });

    // Get orders with pagination
    const orders = await db.orders.findAll({
      where: whereClause,
      include: [
        {
          model: db.customers,
          as: "customer",
          attributes: ['name', 'email']
        },
        {
          model: db.addresses,
          as: "address",
          attributes: ['line1', 'city', 'state', 'country']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    // Format orders for frontend
    const formattedOrders = orders.map(order => {
      const products = JSON.parse(order.products || '[]');
      const shippingDetails = JSON.parse(order.shippingDetails || '{}');
      
      return {
        orderId: order.orderId,
        id: order.orderId, // For compatibility
        dueDate: shippingDetails.estimatedDelivery ? 
          new Date(shippingDetails.estimatedDelivery).toLocaleDateString('en-US', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
          }) : 
          new Date(order.createdAt).toLocaleDateString('en-US', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
          }),
        placedAt: new Date(order.createdAt).toLocaleDateString('en-US', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        }),
        price: order.total,
        total: order.total,
        status: order.status,
        subtotal: order.subTotal,
        discount: order.discount,
        tax: JSON.parse(order.taxes || '{}').gst || 0,
        delivery: 0, // Free shipping
        items: products.map(item => ({
          id: item.productId,
          name: item.name,
          image: item.image,
          color: item.color || '-',
          size: item.size || '-',
          price: item.price,
          quantity: item.quantity,
          expectedDelivery: shippingDetails.estimatedDelivery ? 
            new Date(shippingDetails.estimatedDelivery).toLocaleDateString() : '-'
        })),
        customer: order.customer,
        address: order.address,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      };
    });

    res.json({
      orders: formattedOrders,
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      userId
    });

  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ 
      error: "Failed to fetch orders",
      details: error.message 
    });
  }
});

// GET /api/orders/:orderId - Get single order details
router.get("/:orderId", authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await db.orders.findOne({
      where: { 
        orderId: orderId,
        customerId: userId 
      },
      include: [
        {
          model: db.customers,
          as: "customer",
          attributes: ['name', 'email', 'phone']
        },
        {
          model: db.addresses,
          as: "address",
          attributes: ['line1', 'line2', 'city', 'state', 'country', 'zipcode']
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const products = JSON.parse(order.products || '[]');
    const shippingDetails = JSON.parse(order.shippingDetails || '{}');
    const paymentDetails = JSON.parse(order.paymentDetails || '{}');

    const orderDetails = {
      orderId: order.orderId,
      status: order.status,
      paymentStatus: 'Paid', // Assuming all orders in DB are paid
      customerEmail: order.customer?.email,
      customerName: order.customer?.name,
      customerPhone: order.customer?.phone,
      summary: {
        subtotal: order.subTotal,
        shipping: 0, // Free shipping
        estimatedTax: JSON.parse(order.taxes || '{}').gst || 0,
        promoCode: order.couponCode || '',
        sale: order.discount,
        total: order.total,
        currency: 'USD'
      },
      items: products.map(item => ({
        productId: item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
        color: item.color || '-',
        size: item.size || '-'
      })),
      shippingAddress: {
        line1: order.address?.line1,
        line2: order.address?.line2,
        city: order.address?.city,
        state: order.address?.state,
        country: order.address?.country,
        zipcode: order.address?.zipcode
      },
      paymentMethod: paymentDetails.method || 'Card',
      cardDetails: paymentDetails.cardDetails,
      timeline: generateOrderTimeline(order.status, order.createdAt),
      message: `Order placed successfully! An order confirmation has been sent to ${order.customer?.email}.`,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    };

    res.json(orderDetails);

  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ 
      error: "Failed to fetch order details",
      details: error.message 
    });
  }
});

// Helper function to generate order timeline
function generateOrderTimeline(status, createdAt) {
  const timeline = [
    { status: 'Order placed', date: createdAt, completed: true }
  ];

  const statusMap = {
    'Created': ['Order placed'],
    'Accepted': ['Order placed', 'Order confirmed'],
    'Ready To Ship': ['Order placed', 'Order confirmed', 'Preparing for shipment'],
    'Dispatched': ['Order placed', 'Order confirmed', 'Preparing for shipment', 'Shipped'],
    'In Transist': ['Order placed', 'Order confirmed', 'Preparing for shipment', 'Shipped', 'Out for delivery'],
    'Delivered': ['Order placed', 'Order confirmed', 'Preparing for shipment', 'Shipped', 'Out for delivery', 'Delivered'],
    'Returned': ['Order placed', 'Order confirmed', 'Preparing for shipment', 'Shipped', 'Out for delivery', 'Delivered', 'Returned'],
    'Cancelled': ['Order placed', 'Order cancelled']
  };

  const statuses = statusMap[status] || ['Order placed'];
  
  return statuses.map((status, index) => ({
    status,
    date: index === 0 ? createdAt : null,
    completed: true
  }));
}

export default router;
