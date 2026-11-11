import express from "express";
import { approveOrder, createOrder, getOrders } from "../controller/order.controller.js";
import { authenticateAdmin, authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateToken, createOrder);
router.get("/admin", authenticateToken, authenticateAdmin, getOrders);
router.patch("/:id/approve", authenticateToken, authenticateAdmin, approveOrder);

export default router;
