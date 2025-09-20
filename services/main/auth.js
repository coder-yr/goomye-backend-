import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../admin/db.js";

const router = Router();

// Register
router.post("/register", async (req, res) => {
  const { name, email, phone, password, confirmPassword, whatsappUpdates } = req.body;
  if (!name || !email || !phone || !password || !confirmPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }
  try {
    const existing = await db.customers.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: "Email already registered" });
    const hash = await bcrypt.hash(password, 10);
    const user = await db.customers.create({
      name,
      email,
      phone,
      password: hash,
      whatsappUpdates: typeof whatsappUpdates === "boolean" ? whatsappUpdates : false
    });
    res.status(201).json({ message: "User registered", user: { id: user.id, email: user.email, phone: user.phone, whatsappUpdates: user.whatsappUpdates } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });
  try {
    const user = await db.customers.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "secret", { expiresIn: "1d" });
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

export default router;
