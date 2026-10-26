import express from "express";
import jwt from "jsonwebtoken";
import usersModel from "../models/users.model.js";

const router = express.Router();

router.post("/create", async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, "491359b53d557a797597426fb512a328");
        const user = await usersModel.findOne({ _id: decoded.id });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log(user);
        return res.status(201).json({ message: "post created", user: user.username });
    } catch (error) {
        return res.status(401).json({ message: "invalid token", error: error.message });
    }
});

export default router;