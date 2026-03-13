import jwt from "jsonwebtoken";

// GENERAL AUTH MIDDLEWARE — verifies JWT token for any logged-in user
export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "No token. Unauthorized." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

// ADMIN-ONLY MIDDLEWARE — verifies token AND ensures user is an admin
export const adminMiddleware = (req, res, next) => {
    authMiddleware(req, res, () => {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden. Admins only." });
        }
        next();
    });
};
