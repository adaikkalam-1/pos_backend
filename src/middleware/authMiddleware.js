const db = require('../../config/dbConfig');
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;
    console.log("Authorization Header:", token);

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const parts = token.split(" ");
        if (parts[0] !== "Bearer" || !parts[1]) {
            return res.status(401).json({ error: "Invalid token format" });
        }

        const rawToken = parts[1].replace(/"/g, "");

        const decoded = jwt.verify(rawToken, process.env.JWT_SECRET);
        req.user = await db("users").where({ id: decoded.user_id }).first();

        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ error: error.message });
    }
};

module.exports = authMiddleware;
