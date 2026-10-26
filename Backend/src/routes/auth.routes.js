import express from "express"
import {createUser, deleteUser, getUsers, loginUser, registerUser, updateUser} from "../controller/auth.controller.js"
import {authenticateAdmin, authenticateToken} from "../middlewares/auth.middleware.js"
import usersModel from "../models/users.model.js"
const router = express.Router()

// /api/auth/register

router.post("/register", registerUser);
router.get("/test" , (req,res) => {
    console.log("Cookies" , req.cookies)
    res.json({message: "Cookie recieved",
        cookies: req.cookies
    })
})
router.post("/login", loginUser)
router.post("/logout", (req, res) => {
    res.clearCookie("token");
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