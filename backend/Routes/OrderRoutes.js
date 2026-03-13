import express from "express";
import { placeOrder, getOrders } from "../Controllers/orderControllers.js";
import { adminMiddleware } from "../Middleware/authMiddleware.js";

const router = express.Router();

// POST /api/orders — customer places an order 
router.post("/", placeOrder);

// GET /api/orders — PROTECTED: admin only can view all orders
router.get("/", adminMiddleware, getOrders);

export default router;
