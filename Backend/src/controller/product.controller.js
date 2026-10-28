import productModel from "../models/products.model.js";
import uploadFile from "../../services/storage.service.js";
import mongoose from "mongoose";

export async function createProduct(req, res) {
    if (!req.file) {
        return res.status(400).json({
            message: "Image is required"
        });
    }

    const { name, desc, price, category, unit, rating } = req.body;
    const productRating = rating === undefined ? 5 : Number(rating);

    if (!name?.trim() || !desc?.trim() || !Number.isFinite(Number(price)) || Number(price) < 0 ||
        !Number.isFinite(productRating) || productRating < 0 || productRating > 5) {
        return res.status(400).json({
            message: "Name, description, price, and a valid rating are required"
        });
    }

    try {
        const uploadImage = await uploadFile(req.file.buffer);

        const product = await productModel.create({
            image: uploadImage.url,
            name: name.trim(),
            desc: desc.trim(),
            price: Number(price),
            category: category?.trim() || "Pantry",
            unit: unit?.trim() || "each",
            rating: productRating,
            admin: req.user.id
        });

        return res.status(201).json({
            message: "Product added",
            product
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to create product",
            error: error.message
        });
    }
}

export async function updateProduct(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid product ID" });
    }

    try {
        const product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const { name, desc, price, category, unit, rating } = req.body;
        if (name !== undefined) product.name = name.trim();
        if (desc !== undefined) product.desc = desc.trim();
        if (price !== undefined) {
            if (!Number.isFinite(Number(price)) || Number(price) < 0) {
                return res.status(400).json({ message: "Price must be a valid non-negative number" });
            }
            product.price = Number(price);
        }
        if (category !== undefined) product.category = category.trim();
        if (unit !== undefined) product.unit = unit.trim();
        if (rating !== undefined) {
            const nextRating = Number(rating);
            if (!Number.isFinite(nextRating) || nextRating < 0 || nextRating > 5) {
                return res.status(400).json({ message: "Rating must be between 0 and 5" });
            }
            product.rating = nextRating;
        }
        if (req.file) {
            const uploadImage = await uploadFile(req.file.buffer);
            product.image = uploadImage.url;
        }

        await product.save();
        return res.status(200).json({ message: "Product updated", product });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update product",
            error: error.message
        });
    }
}

export async function deleteProduct(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid product ID" });
    }

    try {
        const product = await productModel.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ message: "Product deleted" });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete product",
            error: error.message
        });
    }
}

export async function getProduct(req, res) {
    try {
        const products = await productModel.find().sort({ createdAt: -1 }).populate("admin", "username email");
        return res.status(200).json({
            message: "Products retrieved successfully",
            products
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve products",
            error: error.message
        });
    }
}
