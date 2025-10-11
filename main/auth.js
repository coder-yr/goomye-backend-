
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '../services/admin/db.js';
import dotenv from 'dotenv';
dotenv.config({ path: './services/admin/.env' });

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// JWT Middleware
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Register Route
router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password || !phone) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({ name, email, password: hashedPassword, phone });
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const user = await db.user.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

export default router;