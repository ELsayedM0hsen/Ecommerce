const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshtoken");
const validateMongoDbId = require("../utils/validateMongodbId");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailCtrl");
const crypto = require("crypto");

const createUser = asyncHandler(async (req, res) => {
  try {
    const email = req.body.email;
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login user

const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
      const refreshToken = await generateRefreshToken(findUser?._id);
      const updateuser = await User.findByIdAndUpdate(
        findUser?._id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
      res.json({
        _id: findUser?._id,
        firstName: findUser?.firstName,
        lastName: findUser?.lastName,
        email: findUser?.email,
        mobile: findUser?.mobile,
        address: findUser?.address,
        city: findUser?.city,
        isBlocked: findUser?.isBlocked,
        token: generateToken(findUser?._id),
        refreshToken: refreshToken,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// admin login
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findAdmin = await User.findOne({ email });
  if (findAdmin.role !== "admin") throw new Error("Not Authorised");
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateuser = await User.findByIdAndUpdate(
      findAdmin?._id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findAdmin?._id,
      firstName: findAdmin?.firstName,
      lastName: findAdmin?.lastName,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
      refreshToken: refreshToken,
    });
  } else {
    throw new Error("Incorrect information");
  }
});

// handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  try {
    const cookie = req.cookies;
    if (!cookie.refreshToken) {
      throw new Error("no refresh token");
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });

    if (!user) {
      throw new Error("no refresh token matched");
    }
    // res.json(user)
    jwt.verify(
      refreshToken,
      process.env.REFRESH_JWT_SECRET,
      async (err, decoded) => {
        console.log(decoded);
        if (err) {
          return res.status(403).json({ message: "Forbidden" });
        }
        if (user.id !== decoded.id)
          return res.status(401).json({ message: "Unauthorized" });
        const accessToken = generateToken(user._id);
        res.json(accessToken);
      }
    );
  } catch (error) {
    console.log(error);
  }
});
// logout functionality

const logout = asyncHandler(async (req, res) => {
  try {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      return res.sendStatus(204);
    }
    await User.findOneAndUpdate(
      { refreshToken: refreshToken },
      {
        refreshToken: "",
      }
    );
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.json("logout success");
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update a user

const updatedUser = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const updatedUser = await User.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
});

// Get all users

const getallUser = asyncHandler(async (req, res, next) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (err) {
    next(err);
  }
});

// Get a single user

const getaUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const getaUser = await User.findById(id);
    res.json({
      getaUser,
    });
  } catch (err) {
    next(err);
  }
});

// Delete a single user

const deleteaUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    res.json({
      deletedUser,
    });
  } catch (err) {
    next(err);
  }
});

const blockUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const blockUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({
      blockUser,
      message: "User Blocked",
    });
  } catch (error) {
    next(error);
  }
});

const unblockUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const unBlockUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      unBlockUser,
      message: "User UnBlocked",
    });
  } catch (error) {
    next(error);
  }
});

/*---------password-control----- */
const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { oldPassword, newPassword } = req.body;
  validateMongoDbId(_id);
  const user = await User.findById(_id);
  if (user && (await user.isPasswordMatched(oldPassword))) {
    user.password = newPassword;
    const updatedPassword = await user.save();
    res.json({
      updatedPassword,
      message: "Updated Successfully",
    });
  } else {
    res.json({
      message: "Old Password not correct",
    });
  }
});

const forgotPasswordToken = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json({ status: "fail", message: "User not found with this email" });
  }
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:3001/reset-password/${token}'>Click Here</>`;
    const data = {
      to: email,
      text: "hey user",
      subject: "forget password link",
      htm: resetURL,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    next(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(400).json({ status: "fail", message: "Expired Token" });
  }
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json({ status: "success", message: "Password reset successful", user });
});

/*--------user-wishlist----- */
const getWishList = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    next(error);
  }
});

module.exports = {
  createUser,
  loginUserCtrl,
  getallUser,
  getaUser,
  deleteaUser,
  updatedUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishList,
};
