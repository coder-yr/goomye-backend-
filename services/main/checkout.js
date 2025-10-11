import express from "express";
import db from "../admin/db.js";
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// POST /api/checkout/guest - Guest checkout endpoint
router.post("/guest", async (req, res) => {
  try {
    const { email, shippingAddress, shippingMethod, cart } = req.body;

    // Validate required fields
    if (!email || !shippingAddress || !cart || !Array.isArray(cart)) {
      return res.status(400).json({ 
        error: "Missing required fields: email, shippingAddress, cart" 
      });
    }

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = 0; // Could be calculated from coupons
    const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax
    const total = subtotal + tax - discount;

    // Generate unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create guest customer record
    const customer = await db.customers.create({
      name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      email: email,
      phone: shippingAddress.phone || null,
      country: shippingAddress.country,
      whatsappUpdates: false,
      isGuest: true
    });

    // Create address record
    const address = await db.addresses.create({
      customerId: customer.id,
      line1: shippingAddress.address,
      line2: shippingAddress.apartment || null,
      city: shippingAddress.city,
      state: shippingAddress.state,
      country: shippingAddress.country,
      zipcode: shippingAddress.zipCode,
      isHomeAddress: true
    });

    // Create order record
    const order = await db.orders.create({
      orderId: orderId,
      customerId: customer.id,
      addressId: address.id,
      status: "Created",
      products: JSON.stringify(cart.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        image: item.image
      }))),
      subTotal: subtotal,
      discount: discount,
      total: total,
      taxes: JSON.stringify({ gst: tax }),
      shippingDetails: JSON.stringify({
        method: shippingMethod,
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days from now
      })
    });

    // Clear the cart (assuming cart ID 1 for guest users)
    if (cart.length > 0) {
      await db.cart_item.destroy({ where: { cartId: 1 } });
    }

    const orderConfirmation = {
      orderId: orderId,
      status: "confirmed",
      message: "Order placed successfully!",
      email,
      shippingAddress,
      shippingMethod,
      cart,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      total: total,
      currency: "USD",
      customerId: customer.id,
      orderDate: new Date().toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short', 
        hour: 'numeric', 
        minute: '2-digit' 
      })
    };

    res.status(201).json(orderConfirmation);
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ 
      error: "Failed to process checkout",
      details: error.message 
    });
  }
});

export default router;
