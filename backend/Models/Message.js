import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null, 
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    conversation: [
        {
            sender: { 
                type: String, 
                enum: ["user", "admin"], 
                required: true 
            },
            text: { 
                type: String, 
                required: true 
            },
            timestamp: { 
                type: Date, 
                default: Date.now 
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Message = mongoose.model("Message", MessageSchema);
export default Message;
