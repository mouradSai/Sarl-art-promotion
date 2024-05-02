// roleMiddleware.js
const jwt = require('jsonwebtoken');

const verifyRole = (roles) => (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Bearer Token
    if (!token) {
        return res.status(401).send({ message: "Access Denied: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
        const userRole = decoded.role;
        if (roles.includes(userRole)) {
            next();
        } else {
            res.status(403).send({ message: "Access Denied: You don't have enough privileges" });
        }
    } catch (error) {
        res.status(400).send({ message: "Invalid token" });
    }
};

module.exports = verifyRole;
