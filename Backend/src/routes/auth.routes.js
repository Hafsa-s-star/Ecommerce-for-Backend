import express from "express"
import {createUser, deleteUser, getUsers, loginUser, registerUser, updateUser} from "../controller/auth.controller.js"
import {authenticateAdmin, authenticateToken} from "../middlewares/auth.middleware.js"
import usersModel from "../models/users.model.js"
import passport from "passport"
import jwt from "jsonwebtoken"
import { googleOAuthConfigured } from "../config/googlePassport.js"
import { authCookieOptions } from "../config/authCookies.js"
const router = express.Router()
const frontendUrl = process.env.FRONTEND_URL || "https://ecommerce-for-backend-r1b2.vercel.app"

function redirectToFrontend(res, authError) {
    const url = new URL(frontendUrl)
    if (authError) {
        url.searchParams.set("authError", authError)
    }
    return res.redirect(url.toString())
}

// /api/auth/register

router.post("/register", registerUser);
router.get("/google", (req, res, next) => {
    if (!googleOAuthConfigured) {
        return redirectToFrontend(res, "google_not_configured")
    }
    return passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false
    })(req, res, next)
})
router.get("/google/callback", (req, res, next) => {
    if (!googleOAuthConfigured) {
        return redirectToFrontend(res, "google_not_configured")
    }
    return passport.authenticate("google", { session: false }, (error, user) => {
        if (error) {
            console.error("Google sign-in failed.", error)
            return redirectToFrontend(res, "google")
        }
        if (!user) {
            return redirectToFrontend(res, "google")
        }

        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET)
        res.cookie("token", token, authCookieOptions)
        return redirectToFrontend(res)
    })(req, res, next)
})
router.get("/test" , (req,res) => {
    console.log("Cookies" , req.cookies)
    res.json({message: "Cookie recieved",
        cookies: req.cookies
    })
})
router.post("/login", loginUser)
router.post("/logout", (req, res) => {
    res.clearCookie("token", authCookieOptions);
    return res.status(200).json({ message: "Logout successful" });
});
router.get("/me", authenticateToken, async (req, res) => {
    try {
        const user = await usersModel.findById(req.user.id).select("username email role");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            user: { id: user._id, username: user.username, email: user.email, role: user.role }
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to retrieve user", error: error.message });
    }
});
router.get("/users", authenticateToken, authenticateAdmin, getUsers);
router.post("/users", authenticateToken, authenticateAdmin, createUser);
router.patch("/users/:id", authenticateToken, authenticateAdmin, updateUser);
router.delete("/users/:id", authenticateToken, authenticateAdmin, deleteUser);

export default router;