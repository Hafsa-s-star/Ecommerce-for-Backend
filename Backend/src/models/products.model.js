import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    desc: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    category: {
        type: String,
        default: "Pantry"
    },

    unit: {
        type: String,
        default: "each"
    },

    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 5
    },

    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    }
}, { timestamps: true });

const productsModel = mongoose.model("products", productsSchema);
export default productsModel;
