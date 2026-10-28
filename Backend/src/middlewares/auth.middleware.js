import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);

        // if (req.user.role !== "admin") {
        //     return res.status(403).json({ message: "Forbidden" });
        // }

        return next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token",
            err: err.message
        });
    }
}

export function authenticateAdmin(req, res, next) {
     if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();

}