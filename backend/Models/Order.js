import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
        },
        shippingAddress: {
            street:     { type: String },
            city:       { type: String },
            province:   { type: String },
            postalCode: { type: String },
            country:    { type: String, default: "Pakistan" },
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
                title:    String,
                price:    Number,
                image:    String,
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
        ],
        totalPrice: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            default: "Cash on Delivery",
        },
        status: {
            type: String,
            enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
            default: "Pending",
        },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;
