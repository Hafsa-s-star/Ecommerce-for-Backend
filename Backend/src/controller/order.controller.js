import mongoose from "mongoose";
import ordersModel from "../models/orders.model.js";
import userModel from "../models/users.model.js";

function roundCurrency(amount) {
    return Math.round((amount + Number.EPSILON) * 100) / 100;
}

async function createOrder(req, res) {
    try {
        const user = await userModel.findById(req.user.id).populate("cart.product");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.cart.length === 0) {
            return res.status(400).json({ message: "Your cart is empty" });
        }

        const items = [];
        for (const cartItem of user.cart) {
            const product = cartItem.product;
            if (!product) {
                return res.status(400).json({
                    message: "A product in your cart is no longer available. Remove it and try again."
                });
            }
            if (!Number.isInteger(cartItem.quantity) || cartItem.quantity < 1 ||
                !Number.isFinite(product.price) || product.price < 0) {
                return res.status(400).json({ message: "Your cart contains an invalid item. Please update it and try again." });
            }

            const price = roundCurrency(product.price);
            items.push({
                product: product._id,
                name: product.name,
                image: product.image,
                unit: product.unit,
                price,
                quantity: cartItem.quantity,
                lineTotal: roundCurrency(price * cartItem.quantity)
            });
        }

        const order = await ordersModel.create({
            user: user._id,
            customer: { name: user.username, email: user.email },
            items,
            total: roundCurrency(items.reduce((sum, item) => sum + item.lineTotal, 0))
        });

        user.cart = [];
        await user.save();

        return res.status(201).json({
            message: "Order submitted for admin approval",
            order
        });
    } catch (error) {
        console.error("Failed to create FreshMarket order.", error);
        return res.status(500).json({ message: "Failed to submit your order" });
    }
}

async function getOrders(req, res) {
    try {
        const orders = await ordersModel.find().sort({ createdAt: -1 }).lean();
        return res.status(200).json({ orders });
    } catch (error) {
        console.error("Failed to retrieve FreshMarket orders.", error);
        return res.status(500).json({ message: "Failed to retrieve orders" });
    }
}

async function approveOrder(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid order ID" });
    }

    try {
        const order = await ordersModel.findOneAndUpdate(
            { _id: req.params.id, status: "pending" },
            { $set: { status: "approved", approvedAt: new Date(), approvedBy: req.user.id } },
            { new: true, runValidators: true }
        );
        if (order) {
            return res.status(200).json({ message: "Order approved", order });
        }

        const existingOrder = await ordersModel.findById(req.params.id).select("status");
        if (!existingOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        return res.status(409).json({ message: "This order has already been processed" });
    } catch (error) {
        console.error("Failed to approve FreshMarket order.", error);
        return res.status(500).json({ message: "Failed to approve order" });
    }
}

export { approveOrder, createOrder, getOrders };
