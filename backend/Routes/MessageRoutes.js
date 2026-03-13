import express from "express";
import { sendMessage, getMessages, deleteMessage, addChatMessage, getUserMessages } from "../Controllers/messageControllers.js";
import { authMiddleware, adminMiddleware } from "../Middleware/authMiddleware.js";

const router = express.Router();

// POST /api/messages - Public (Initial Inquiry)
router.post("/", sendMessage);

// GET /api/messages - Admin Only (all threads)
router.get("/", adminMiddleware, getMessages);

// DELETE /api/messages/:id - Admin Only
router.delete("/:id", adminMiddleware, deleteMessage);

// POST /api/messages/:id/chat - Any Auth User (Append message to thread)
router.post("/:id/chat", authMiddleware, addChatMessage);

// GET /api/messages/my-messages - User Only (their own threads)
router.get("/my-messages", authMiddleware, getUserMessages);

export default router;
