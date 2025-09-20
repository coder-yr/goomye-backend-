import express from "express";
const router = express.Router();

// GET /api/orders - List orders for logged-in user (mock)
router.get("/", (req, res) => {
  // In a real app, use req.user.id for filtering
  // For now, return mock paginated orders
  const { status, search, page = 1, limit = 10, dateRange } = req.query;

  // Mock data
  const allOrders = [
    { orderId: "FWB127364372", dueDate: "09 Mar 2023", price: 466, status: "Pre-order" },
    { orderId: "FWB125467980", dueDate: "12 Mar 2023", price: 245, status: "In transit" },
    { orderId: "FWB139485607", dueDate: "19 Mar 2023", price: 2000, status: "Confirmed" },
    { orderId: "FWB137364371", dueDate: "23 Apr 2023", price: 90, status: "Confirmed" },
    { orderId: "FWB148273645", dueDate: "20 Apr 2023", price: 3040, status: "Cancelled" },
    { orderId: "FWB146284623", dueDate: "30 Apr 2023", price: 2999, status: "Confirmed" },
    { orderId: "FWB145967376", dueDate: "09 May 2023", price: 1870, status: "Confirmed" },
    { orderId: "FWB148756352", dueDate: "05 Jun 2023", price: 5067, status: "Cancelled" },
    { orderId: "FWB159873546", dueDate: "31 May 2023", price: 60, status: "Confirmed" },
    { orderId: "FWB156475937", dueDate: "24 Jun 2023", price: 76, status: "Confirmed" }
  ];

  // Filter by status
  let filtered = allOrders;
  if (status && status !== "All") {
    filtered = filtered.filter(o => o.status.toLowerCase() === status.toLowerCase());
  }
  // Filter by search (orderId)
  if (search) {
    filtered = filtered.filter(o => o.orderId.includes(search));
  }
  // TODO: Filter by dateRange if needed

  // Pagination
  const total = 1000;
  const start = (page - 1) * limit;
  const end = start + Number(limit);
  const orders = filtered.slice(start, end);

  res.json({
    orders,
    page: Number(page),
    limit: Number(limit),
    total,
    totalPages: Math.ceil(total / limit)
  });
});

export default router;
