import Order from "../Models/Order.js";

// PLACE ORDER
export const placeOrder = async (req, res) => {
    try {
        const { userName, email, phone, shippingAddress, products, totalPrice } = req.body;

        const newOrder = new Order({
            userName,
            email,
            phone,
            shippingAddress,
            products,
            totalPrice,
            paymentMethod: "Cash on Delivery",
        });

        await newOrder.save();

        res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: "Failed to place order", error: error.message });
    }
};

// GET ALL ORDERS (Admin)
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
};
