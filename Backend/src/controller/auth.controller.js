import usersModel from "../models/users.model.js";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

async function registerUser(req, res) {
    try {
        const { username, email, password, role } = req.body;
        const userAlreadyExists = await usersModel.findOne({
            $or: [
                { username },
                { email }
            ]
        })
        if (userAlreadyExists) {
            return res.status(409).json({ message: "User Already Exist" })
        }

        const hash = await bcrypt.hash(password, 12)

        const user = await usersModel.create({ username, email, password: hash, role })
        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, "491359b53d557a797597426fb512a328")

        res.cookie("token", token)

        res.status(201).json({ message: "User Created Sucessfully", user, token })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server error" })
    }
}

async function loginUser(req, res) {
    const { username, email, password } = req.body;
    const user = await usersModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid Password" })
    }

    console.log(user)

    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, "491359b53d557a797597426fb512a328")

    res.cookie("token", token)
    return res.status(200).json({
        message: "Login successful",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    });
}

async function getUsers(req, res) {
    try {
        const users = await usersModel.find().select("username email role createdAt");
        return res.status(200).json({ users });
    } catch (error) {
        return res.status(500).json({ message: "Failed to retrieve users", error: error.message });
    }
}

async function createUser(req, res) {
    try {
        const { username, email, password, role } = req.body;
        if (!username?.trim() || !email?.trim() || !password || password.length < 8) {
            return res.status(400).json({ message: "Username, email, and a password of at least 8 characters are required" });
        }
        if (role && !["user", "admin"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }
        const existingUser = await usersModel.findOne({
            $or: [{ username: username.trim() }, { email: email.trim().toLowerCase() }]
        });
        if (existingUser) {
            return res.status(409).json({ message: "Username or email already exists" });
        }
        const user = await usersModel.create({
            username: username.trim(),
            email: email.trim().toLowerCase(),
            password: await bcrypt.hash(password, 12),
            role: role || "user"
        });
        return res.status(201).json({
            message: "User created",
            user: { id: user._id, username: user.username, email: user.email, role: user.role, createdAt: user.createdAt }
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to create user", error: error.message });
    }
}

async function updateUser(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }
    try {
        const { username, email, role } = req.body;
        if (role !== undefined && !["user", "admin"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }
        const user = await usersModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (username !== undefined) user.username = username.trim();
        if (email !== undefined) user.email = email.trim().toLowerCase();
        if (role !== undefined) user.role = role;
        await user.save();
        return res.status(200).json({
            message: "User updated",
            user: { id: user._id, username: user.username, email: user.email, role: user.role, createdAt: user.createdAt }
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to update user", error: error.message });
    }
}

async function deleteUser(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }
    if (req.params.id === req.user.id) {
        return res.status(400).json({ message: "You cannot delete your own account" });
    }
    try {
        const user = await usersModel.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User deleted" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete user", error: error.message });
    }
}

export { registerUser, loginUser, getUsers, createUser, updateUser, deleteUser }