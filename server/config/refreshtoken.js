const jwt = require("jsonwebtoken");

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.REFRESH_JWT_SECRET, { expiresIn: "2d" });
};

module.exports = { generateRefreshToken };