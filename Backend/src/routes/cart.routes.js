import express from "express";
import {addToCart, clearCart, deleteCartItem, getCart, updateCartItem} from "../controller/cart.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/items", authenticateToken, addToCart);
router.patch("/items/:productId", authenticateToken, updateCartItem);
router.delete("/items/:productId", authenticateToken, deleteCartItem);
router.delete("/clear", authenticateToken, clearCart);
router.get("/", authenticateToken, getCart);

export default router;