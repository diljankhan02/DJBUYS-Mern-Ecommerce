import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { signup, signin, adminSignin } from "../Controllers/authControllers.js";
import configs from "../configs/config.js";

const router = express.Router();

// POST /api/auth/signup — customer registration
router.post("/signup", signup);

// POST /api/auth/signin — customer login only
router.post("/signin", signin);

// POST /api/auth/admin/signin — separate admin login
router.post("/admin/signin", adminSignin);

// GET /api/auth/google — redirect to Google 
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// GET /api/auth/google/callback — Google redirects here after login 
router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/" }),
    (req, res) => {
        // Sign JWT with user details 
        const token = jwt.sign(
            {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
            },
            process.env.SECRET_KEY,
            { expiresIn: "7d" }
        );

        // Redirect to frontend /success page with token in URL
        res.redirect(`${configs.googleAuthClientSuccessURL}/success?token=${token}`);
    }
);

export default router;
