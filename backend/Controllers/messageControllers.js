import Message from "../Models/Message.js";

// @desc    Send a message
// @route   POST /api/messages
// @access  Public
// ─── SEND MESSAGE (Initial Inquiry) ──────────────────────────────────────────
export const sendMessage = async (req, res) => {
    try {
        const { name, email, message, userId } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newMessage = new Message({ 
            name, 
            email, 
            userId: userId || null,
            conversation: [{ sender: "user", text: message }]
        });
        await newMessage.save();

        res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to send message", error: error.message });
    }
};

// ─── ADD CHAT MESSAGE (For Admin & User) ─────────────────────────────────────
export const addChatMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const { id } = req.params;
        const sender = req.user.role === "admin" ? "admin" : "user";

        if (!text) {
            return res.status(400).json({ message: "Message text is required" });
        }

        const updatedMessage = await Message.findByIdAndUpdate(
            id,
            { 
                $push: { conversation: { sender, text, timestamp: new Date() } }
            },
            { new: true }
        );

        if (!updatedMessage) {
            return res.status(404).json({ message: "Chat thread not found" });
        }

        res.status(200).json({ message: "Message added", updatedMessage });
    } catch (error) {
        res.status(500).json({ message: "Failed to add message", error: error.message });
    }
};

// ─── GET ALL MESSAGES (Admin Only) ───────────────────────────────────────────
export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ updatedAt: -1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ─── DELETE MESSAGE (Admin Only) ──────────────────────────────────────────────
export const deleteMessage = async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Thread deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete thread", error: error.message });
    }
};

// ─── GET USER MESSAGES (Inbox) ────────────────────────────────────────────────
export const getUserMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        const messages = await Message.find({ userId }).sort({ updatedAt: -1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch your inbox", error: error.message });
    }
};
