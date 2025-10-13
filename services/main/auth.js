import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../admin/db.js";
import { Op } from "sequelize";

const router = Router();

// Signup (User Registration)
router.post("/signup", async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }
  try {
    const existing = await db.user.findOne({
      where: {
        [Op.or]: [{ email }, { phone }],
      },
    });
    if (existing) return res.status(409).json({ error: "Email or phone already registered" });
    const hash = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      name,
      email,
      phone,
      password: hash,
    });
    // Also create a customer record for this user
    const customer = await db.customers.create({
      name,
      email,
      phone,
      whatsappUpdates: false,
      userId: user.id,
      isGuest: false,
    });
    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "default_secret", { expiresIn: "1d" });
    res.status(201).json({
      message: "Signup successful",
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
      customer: { id: customer.id, name: customer.name, email: customer.email },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });
  try {
    // Use the same user table used for signup
    const user = await db.user.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "default_secret", { expiresIn: "1d" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Forgot Password (send reset link - placeholder)
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });
  // Here you would generate a token and send an email
  res.json({ message: "Password reset link sent (not implemented)" });
});

// Reset Password (with token - placeholder)
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  // Here you would verify the token and update the password
  res.json({ message: "Password reset (not implemented)" });
});


// JWT authentication middleware
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export default router;
