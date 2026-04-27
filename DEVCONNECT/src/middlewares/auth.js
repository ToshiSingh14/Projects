const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const auth = (req, res, next) => {
    
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send({
            message: "Token required"
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;   // save user data
        next();

    } catch (error) {
        res.status(401).send({
            message: "Invalid token"
        });
    }
};

module.exports = auth;