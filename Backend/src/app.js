import express from "express";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import productRoutes from "./routes/product.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { googleOAuthConfigured } from "./config/googlePassport.js";
import connectDB from "./db/db.js";

const app = express();
app.set("trust proxy", 1);
if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET must be set in the backend environment");
}
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be set in the backend environment");
}

const allowedOrigins = [
    "https://ecommerce-for-backend-r1b2.vercel.app",
    "https://ecommerce-for-backend-r1b2-g9tzim684-hafsa-a943.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
].filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    }
}));
app.use(passport.initialize());

if (!googleOAuthConfigured) {
    console.warn("Google sign-in is disabled. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable it.");
}

app.use("/api", async (req, res, next) => {
    if (req.method === "GET" && req.path === "/auth/google") {
        return next();
    }
    try {
        await connectDB();
        return next();
    } catch (error) {
        console.error("Database connection failed.", error);
        return res.status(503).json({
            message: "The account database is unavailable. Check the backend MONGODB_URI and database network access."
        });
    }
});

app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);

export default app;
