import express from "express";
import db from "../admin/db.js";
import { authenticateToken } from "../../main/auth.js";
const router = express.Router();

// GET /api/orders/:orderId/details
router.get("/orders/:orderId/details", authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    // First find the customer record for this user by email
    const userEmail = req.user.email;
    const customer = await db.customers.findOne({ 
      where: { email: userEmail } 
    });
    
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const order = await db.orders.findOne({
      where: { 
        orderId: orderId,
        customerId: customer.id 
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
      paymentStatus: 'Paid',
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
