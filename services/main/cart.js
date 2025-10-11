
import express from "express";
const router = express.Router();
import db from "../admin/db.js";
const Cart = db.cart || db.cartModel || db.Cart;
const CartItem = db.cart_item || db.cartItem || db.CartItem;
const Product = db.products || db.products || db.products;

// Helper: get or create generic cart (id=1)
async function getOrCreateCart() {
  let cart = await Cart.findOne({ where: { id: 1 } });
  if (!cart) {
    cart = await Cart.create({ userId: 1, status: "active" });
  }
  return cart;
}

// GET /api/cart - Returns current cart
router.get('/', async (req, res) => {
  const cart = await getOrCreateCart();
  const items = await CartItem.findAll({ where: { cartId: cart.id }, include: [{ model: Product, as: "products" }] });
  const cartItems = items.map(item => {
    const product = item.products || item.product;
    return {
      productId: item.productId,
      name: product?.name ?? "",
      image: Array.isArray(product?.images)
        ? product.images[0]
        : (typeof product?.images === "string" ? product.images : ""),
      price: item.price,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
      subtotal: item.price * item.quantity,
    };
  });
  const total = cartItems.reduce((sum, i) => sum + i.subtotal, 0);
  res.json({ items: cartItems, total, currency: "INR" });
});

// POST /api/cart - Add item to cart
router.post('/', async (req, res) => {
  const cart = await getOrCreateCart();
  const { productId, quantity, price, color, size } = req.body;
  let item = await CartItem.findOne({ where: { cartId: cart.id, productId } });
  if (item) {
    item.quantity += quantity || 1;
    await item.save();
  } else {
    await CartItem.create({ cartId: cart.id, productId, quantity: quantity || 1, price, color, size });
  }
  // Return updated cart
  const items = await CartItem.findAll({ where: { cartId: cart.id }, include: [{ model: Product, as: "products" }] });
  const cartItems = items.map(item => {
    const product = item.products || item.product;
    return {
      productId: item.productId,
      name: product?.name ?? "",
      image: Array.isArray(product?.images) ? product.images[0] : "",
      price: item.price,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
      subtotal: item.price * item.quantity,
    };
  });
  const total = cartItems.reduce((sum, i) => sum + i.subtotal, 0);
  res.json({ success: true, cart: { items: cartItems, total, currency: "INR" } });
});

// DELETE /api/cart/:id - Remove item from cart
router.delete('/:id', async (req, res) => {
  const cart = await getOrCreateCart();
  const productId = parseInt(req.params.id);
  const item = await CartItem.findOne({ where: { cartId: cart.id, productId } });
  if (item) {
    await item.destroy();
    // Return updated cart
  const items = await CartItem.findAll({ where: { cartId: cart.id }, include: [{ model: Product, as: "products" }] });
    const cartItems = items.map(item => {
      const product = item.products || item.product;
      return {
        productId: item.productId,
        name: product?.name ?? "",
        image: Array.isArray(product?.images) ? product.images[0] : "",
        price: item.price,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        subtotal: item.price * item.quantity,
      };
    });
    const total = cartItems.reduce((sum, i) => sum + i.subtotal, 0);
    res.json({ success: true, cart: { items: cartItems, total, currency: "INR" } });
  } else {
    res.status(404).json({ success: false, message: 'Item not found' });
  }
});

// PUT /api/cart/:id - Update item quantity
router.put('/:id', async (req, res) => {
  const cart = await getOrCreateCart();
  const productId = parseInt(req.params.id);
  const { quantity } = req.body;
  const item = await CartItem.findOne({ where: { cartId: cart.id, productId } });
  if (item && typeof quantity === 'number' && quantity > 0) {
    item.quantity = quantity;
    await item.save();
    // Return updated cart
  const items = await CartItem.findAll({ where: { cartId: cart.id }, include: [{ model: Product, as: "products" }] });
    const cartItems = items.map(item => {
      const product = item.products || item.product;
      return {
        productId: item.productId,
        name: product?.name ?? "",
        image: Array.isArray(product?.images) ? product.images[0] : "",
        price: item.price,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        subtotal: item.price * item.quantity,
      };
    });
    const total = cartItems.reduce((sum, i) => sum + i.subtotal, 0);
    res.json({ success: true, cart: { items: cartItems, total, currency: "INR" } });
  } else {
    res.status(404).json({ success: false, message: 'Item not found or invalid quantity' });
  }
});

export default router;
