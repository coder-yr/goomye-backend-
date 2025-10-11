import express from "express";
import db from "../admin/db.js";
import { v4 as uuidv4 } from 'uuid';
import { processDemoPayment } from './payment.js';
import { authenticateToken } from "../../main/auth.js";

const router = express.Router();

// POST /api/checkout/pay - Review and Pay endpoint
router.post("/pay", authenticateToken, async (req, res) => {
  try {
    const { paymentMethod, cardDetails, billingAddress, cart, shippingAddress, shippingMethod, useShippingAddress } = req.body;

    // Validate required fields
    if (!paymentMethod || !cart || !Array.isArray(cart) || !shippingAddress) {
      return res.status(400).json({ 
        error: "Missing required fields: paymentMethod, cart, shippingAddress" 
      });
    }

    // Validate payment details
    if (paymentMethod === "card") {
      if (!cardDetails || !cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.cardName) {
        return res.status(400).json({ 
          error: "Missing card details: cardNumber, expiryDate, cvv, cardName" 
        });
      }
    }

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = 0; // Could be calculated from coupons
    const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax
    const total = subtotal + tax - discount;

    // Generate unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Get or create customer record
    const userId = req.user.id;
    const userEmail = req.user.email || shippingAddress.email;
    let customer;
    
    // Check if customer already exists for this user by email
    customer = await db.customers.findOne({ 
      where: { 
        email: userEmail 
      } 
    });
    
    if (!customer) {
      // Create customer record for logged-in user
      customer = await db.customers.create({
        name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        email: userEmail,
        phone: shippingAddress.phone || null,
        country: shippingAddress.country,
        whatsappUpdates: false
      });
    } else {
      // Update existing customer with new shipping info if needed
      await customer.update({
        name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        email: userEmail,
        phone: shippingAddress.phone || customer.phone,
        country: shippingAddress.country || customer.country
      });
    }

    // Create shipping address record
    const shippingAddr = await db.addresses.create({
      customerId: customer.id,
      line1: shippingAddress.address,
      line2: shippingAddress.apartment || null,
      city: shippingAddress.city,
      state: shippingAddress.state,
      country: shippingAddress.country,
      zipcode: shippingAddress.zipCode,
      isHomeAddress: true
    });

    // Create billing address record if different from shipping
    let billingAddr = shippingAddr;
    if (!useShippingAddress && billingAddress) {
      billingAddr = await db.addresses.create({
        customerId: customer.id,
        line1: billingAddress.address,
        line2: billingAddress.apartment || null,
        city: billingAddress.city,
        state: billingAddress.state,
        country: billingAddress.country,
        zipcode: billingAddress.zipCode,
        isHomeAddress: false
      });
    }

    // Create order record
    const order = await db.orders.create({
      orderId: orderId,
      customerId: customer.id,
      addressId: shippingAddr.id,
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
      }),
      paymentDetails: JSON.stringify({
        method: paymentMethod,
        cardDetails: paymentMethod === "card" ? {
          last4: cardDetails.cardNumber.slice(-4),
          expiryDate: cardDetails.expiryDate,
          cardName: cardDetails.cardName
        } : undefined,
        billingAddressId: billingAddr.id
      })
    });

    // Clear the cart for this user
    if (cart.length > 0) {
      // Find the user's cart by customer ID
  const userCart = await db.cart.findOne({ where: { userId: customer.id } });
      if (userCart) {
        await db.cart_item.destroy({ where: { cartId: userCart.id } });
      }
    }

    // Process payment with demo payment service
    let paymentResult = { success: true, status: "succeeded" }; // Default to success for demo
    
    if (paymentMethod === "card") {
      paymentResult = await processDemoPayment({
        cardDetails,
        amount: total,
        currency: 'usd',
        orderId: orderId
      });
    }
    
    const paymentStatus = paymentResult.success ? "success" : "failed";

    const paymentConfirmation = {
      paymentStatus: paymentStatus,
      orderId: orderId,
      message: paymentStatus === "success" ? "Payment processed and order confirmed!" : (paymentResult.error || "Payment failed. Please try again."),
      paymentMethod,
      cardDetails: paymentMethod === "card" ? { 
        last4: cardDetails.cardNumber.slice(-4),
        expiryDate: cardDetails.expiryDate,
        cardName: cardDetails.cardName
      } : undefined,
      billingAddress: useShippingAddress ? shippingAddress : billingAddress,
      shippingAddress,
      shippingMethod,
      cart,
      total: total,
      currency: "USD",
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      customerId: customer.id,
      orderDate: new Date().toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short', 
        hour: 'numeric', 
        minute: '2-digit' 
      }),
      items: cart, // Include items for order confirmation page
      transactionId: paymentResult.transactionId || null,
      paymentError: paymentResult.error || null
    };

    res.status(200).json(paymentConfirmation);
  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500).json({ 
      error: "Payment processing failed",
      details: error.message 
    });
  }
});

export default router;
