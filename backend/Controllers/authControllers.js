import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ─── SIGNUP ──────────────────────────────────────────────────────────────────
export const signup = async (req, res) => {
    try {
        let { name, email, password } = req.body;

        
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields (name, email, password) are required" });
        }

      
        name = name.trim();
        email = email.trim();
        password = password.trim();

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Fields cannot be empty or just whitespace" });
        }

       
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please enter a valid email address" });
        }

        
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Signup failed", error: error.message });
    }
};

// ─── CUSTOMER SIGNIN ─────────────────────────────────────────────────────────
export const signin = async (req, res) => {
    try {
        let { email, password } = req.body;

        if (!email || !password || !email.trim() || !password.trim()) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        email = email.trim();
        password = password.trim();

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid password" });

        
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.SECRET_KEY,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Signed in successfully",
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        res.status(500).json({ message: "Signin failed", error: error.message });
    }
};

// ─── ADMIN SIGNIN (Separate route ) ───────────────────────
// Unlike customer signin, this checks role === "admin" before issuing token
export const adminSignin = async (req, res) => {
    try {
        let { email, password } = req.body;

        if (!email || !password || !email.trim() || !password.trim()) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        email = email.trim();
        password = password.trim();

        
        const admin = await User.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check if this user is actually an admin
        if (admin.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Not an admin account." });
        }

        
        const match = await bcrypt.compare(password, admin.password);
        if (!match) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Sign JWT with role:"admin" 
        const token = jwt.sign(
            { id: admin._id, email: admin.email, role: "admin" },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            token,
            user: { id: admin._id, name: admin.name, email: admin.email, role: "admin" },
        });
    } catch (error) {
        res.status(500).json({ message: "Admin signin failed", error: error.message });
    }
};

// ─── GOOGLE LOGIN ────────────────────────────────────────────────────────────
export const googleLogin = async (req, res) => {
    try {
        const { name, email, googleId } = req.body;

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ name, email, googleId });
            await user.save();
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.SECRET_KEY,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Google login successful",
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        res.status(500).json({ message: "Google login failed", error: error.message });
    }
};
