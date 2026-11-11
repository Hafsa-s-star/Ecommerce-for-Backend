import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products"
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ""
    },
    unit: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    lineTotal: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: false });

const ordersSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    customer: {
        name: { type: String, required: true },
        email: { type: String, required: true }
    },
    items: {
        type: [orderItemSchema],
        required: true,
        validate: {
            validator: (items) => items.length > 0,
            message: "An order must contain at least one item"
        }
    },
    total: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ["pending", "approved"],
        default: "pending"
    },
    approvedAt: {
        type: Date
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }
}, { timestamps: true });

const ordersModel = mongoose.model("orders", ordersSchema);
export default ordersModel;
