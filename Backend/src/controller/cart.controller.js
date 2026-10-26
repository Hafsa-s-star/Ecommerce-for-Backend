import mongoose from "mongoose";
import productModel from "../models/products.model.js";
import userModel from "../models/users.model.js";

async function addToCart(req, res) {
    try {
        const body = req.body;
        if (!body || typeof body !== "object" || Array.isArray(body)) {
            return res.status(400).json({
                message: "Request body must be a JSON object"
            });
        }

        const { productId } = body;
        const quantity = Number(body.quantity) || 1;

        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }
        if (quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1"
            });
        }
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const cartItem = user.cart.find(item => item.product.toString() === productId);
        if (cartItem) {
            cartItem.quantity += quantity;
        } else {
            user.cart.push({ product: productId, quantity});
        }

        await user.save();

        const updatedUser = await userModel.findById(user._id).select("cart").populate("cart.product","name desc image price category unit rating")

        return res.status(200).json({
            message: "Product added to cart",
            cart: updatedUser.cart,updatedUser
        });
    } catch (error) {
        return res.status(400).json({
            message: "Failed to add product to cart",
            error: error.message
        });
    }
}

async function getCart(req, res) {
    try {
        const user = await userModel.findById(req.user.id).select("cart").populate("cart.product","name desc image price category unit rating");
        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }
        return res.status(200).json({
            cart: user.cart
        });
    } catch (error) {
        return res.status(400).json({
            message: "Failed to retrieve cart",
            error: error.message
        });
    }
}

async function updateCartItem(req, res) {
    try {
        const { productId } = req.params;
        const quantity = Number(req.body?.quantity);
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }
        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({ message: "Quantity must be a positive integer" });
        }

        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const cartItem = user.cart.find((item) => item.product.toString() === productId);
        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        cartItem.quantity = quantity;
        await user.save();
        const updatedUser = await userModel.findById(user._id).select("cart")
            .populate("cart.product", "name desc image price category unit rating");
        return res.status(200).json({ message: "Cart quantity updated", cart: updatedUser.cart });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update cart item",
            error: error.message
        });
    }
}

async function deleteCartItem(req, res) {
    try {
        const { productId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const itemCount = user.cart.length;
        user.cart = user.cart.filter((item) => item.product.toString() !== productId);
        if (itemCount === user.cart.length) {
            return res.status(404).json({ message: "Cart item not found" });
        }
        await user.save();
        const updatedUser = await userModel.findById(user._id).select("cart")
            .populate("cart.product", "name desc image price category unit rating");
        return res.status(200).json({ message: "Cart item deleted", cart: updatedUser.cart });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete cart item",
            error: error.message
        });
    }
}

async function clearCart(req, res) {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.cart = [];
        await user.save();
        return res.status(200).json({ message: "Cart cleared", cart: [] });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to clear cart",
            error: error.message
        });
    }
}


export {addToCart, clearCart, deleteCartItem, getCart, updateCartItem};