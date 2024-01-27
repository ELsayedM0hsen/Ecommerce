const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log('decoded', decoded);
        const user = await User.findById(decoded?.id);
        if (!user) return res.status(401).json("user not found");
        req.user = user; // user logining
        next();
      }
    } catch (error) {
      next("Not Authorized token expired, Please Login again");
    }
  } else {
    next(" There is no token attached to header");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  // console.log('req.user: = ', req.user);
  const { email } = req.user;
  try {
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
      return res
        .status(403)
        .json({ message: "You are not authorized for this operation" });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = { authMiddleware, isAdmin };
