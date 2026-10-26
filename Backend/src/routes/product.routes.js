 import express from "express";
import {createProduct, deleteProduct, getProduct, updateProduct } from "../controller/product.controller.js";
const router = express.Router();
import { authenticateToken,authenticateAdmin  } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js"
// /api/auth/register
router.post("/create", authenticateToken,authenticateAdmin,upload.single("image") ,createProduct);
router.patch("/:id", authenticateToken, authenticateAdmin, upload.single("image"), updateProduct);
router.delete("/:id", authenticateToken, authenticateAdmin, deleteProduct);
router.get("/", getProduct);

export default router;