const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    let token;

    // Browser cookie token first
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    // API header token second
    else if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).send({ message: "Token required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).send({ message: "Invalid token" });
    }
};

module.exports = auth;