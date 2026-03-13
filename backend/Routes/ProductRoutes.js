import express from "express";
import multer from "multer";
import { getProducts, updateProduct, deleteProduct, getProductById, addProduct } from "../Controllers/productControllers.js";
import { adminMiddleware } from "../Middleware/authMiddleware.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET /api/products — public, any user can view products
router.get("/", getProducts);

// GET /api/products/:id — public, view single product
router.get("/:id", getProductById);

// POST /api/products — PROTECTED: admin only
router.post("/", adminMiddleware, upload.single("image"), addProduct);

// PUT /api/products/:id — PROTECTED: admin only
router.put("/:id", adminMiddleware, upload.single("image"), updateProduct);

// DELETE /api/products/:id — PROTECTED: admin only
router.delete("/:id", adminMiddleware, deleteProduct);

export default router;
