import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import "./passport/passport.js"; 

import UserRoutes from "./Routes/UserRoutes.js";
import ProductRoutes from "./Routes/ProductRoutes.js";
import OrderRoutes from "./Routes/OrderRoutes.js";
import MessageRoutes from "./Routes/MessageRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize()); 

// Routes
app.use("/api/auth", UserRoutes);
app.use("/api/products", ProductRoutes);
app.use("/api/orders", OrderRoutes);
app.use("/api/messages", MessageRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log(" MongoDB Connected Successfully");
    app.listen(process.env.PORT, () => {
      console.log(` Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Failed:", err.message);
  });
