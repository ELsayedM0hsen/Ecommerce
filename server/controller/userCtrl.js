const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const uniqid = require("uniqid");

const asyncHandler = require("express-async-handler"); // bat loi ma khong can trycatch
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
        maxAge: 72 * 60 * 60 * 1000, // time exists token, milisecond
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
  try {
    // check if user exists or not
    const findAdmin = await User.findOne({ email });
    if (findAdmin.role !== "admin")
      return res.status(401).json({ message: "Not Autherized" });
    const isPasswordValid = await admin.isPasswordMatched(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
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
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// handle refresh token

const handleRefreshToken = asyncHandler(async (req, res) => {
  // kiem tra token cu hop le thi moi tao token moi va tra ve cho nguoi dung
  // const cookie = req.cookies; // len server doc gia tri cookies
  // if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  // const refreshToken = cookie.refreshToken;
  const { refreshToken } = req.body;
  if (!refreshToken) throw new Error("No Refresh Token");
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error(" No Refresh token present in db or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
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
  const { _id } = req.user; // lay tu middleware
  validateMongoDbId(_id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      req.body,
      // {
      //     firstName: req?.body?.firstName,
      //     lastName: req?.body?.lastName,
      //     email: req?.body?.email,
      //     mobile: req?.body?.mobile,
      //     address: req?.body?.address,
      //     city: req?.body?.city,
      // },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
});

// save user Address

const saveAddress = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    next(error);
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
  const { token } = req.params; // chuoi random chua hash
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

// const userCart = asyncHandler(async (req, res) => {
//     const { cart } = req.body;
//     const { _id } = req.user;
//     validateMongoDbId(_id);
//     try {
//         let products = [];
//         const user = await User.findById(_id);
//         // check if user already have product in cart
//         const alreadyExistCart = await Cart.findOne({ orderby: user._id });
//         if (alreadyExistCart) {
//             alreadyExistCart.remove(); // xoa gio hang cu cua nguoi dung, sau do thay the = gio hang moi
//         }
//         for (let i = 0; i < cart.length; i++) {
//             let object = {};
//             object.product = cart[i]._id;
//             object.count = cart[i].count;
//             object.color = cart[i].color;
//             let getPrice = await Product.findById(cart[i]._id).select("price").exec();
//             object.price = getPrice.price;
//             products.push(object);
//         }
//         let cartTotal = 0;
//         for (let i = 0; i < products.length; i++) {
//             cartTotal = cartTotal + products[i].price * products[i].count;
//         }
//         let newCart = await new Cart({ // save lai gio hang moi
//             products,
//             cartTotal,
//             orderby: user?._id,
//         }).save();
//         res.json(newCart);
//     } catch (error) {
//         throw new Error(error);
//     }
// });

// create cart


// const createOrder = asyncHandler(async (req, res) => {
//     const { shippingInfo, orderItems, totalPrice, totalPriceAfterDiscount, paymentMethod } = req.body;
//     const { _id } = req.user;
//     try {
//         const order = await Order.create({
//             shippingInfo, orderItems, totalPrice, totalPriceAfterDiscount, paymentMethod, user: _id
//         })
//         res.json({
//             order,
//             success: true
//         })
//     } catch (error) {
//         next(error)
//     }
// })

// const applyCoupon = asyncHandler(async (req, res) => {
//     const { coupon } = req.body;
//     const { _id } = req.user;
//     validateMongoDbId(_id);
//     const validCoupon = await Coupon.findOne({ name: coupon });
//     if (validCoupon === null) {
//         next("Invalid Coupon");
//     }
//     const user = await User.findOne({ _id });
//     let { cartTotal } = await Cart.findOne({
//         orderby: user._id,
//     }).populate("products.product");
//     let totalAfterDiscount = (
//         cartTotal -
//         (cartTotal * validCoupon.discount) / 100
//     ).toFixed(2);
//     await Cart.findOneAndUpdate(
//         { orderby: user._id },
//         { totalAfterDiscount },
//         { new: true }
//     );
//     res.json(totalAfterDiscount);
// });

// const createOrder = asyncHandler(async (req, res) => {
//     const { COD, couponApplied } = req.body;
//     const { _id } = req.user;
//     validateMongoDbId(_id);
//     try {
//         if (!COD) next("Create cash order failed");
//         const user = await User.findById(_id);
//         let userCart = await Cart.findOne({ orderby: user._id });
//         let finalAmout = 0;
//         if (couponApplied && userCart.totalAfterDiscount) {
//             finalAmout = userCart.totalAfterDiscount;
//         } else {
//             finalAmout = userCart.cartTotal;
//         }

//         let newOrder = await new Order({
//             products: userCart.products,
//             paymentIntent: {
//                 id: uniqid(),
//                 method: "COD",
//                 amount: finalAmout,
//                 status: "Cash on Delivery",
//                 created: Date.now(),
//                 currency: "usd",
//             },
//             orderby: user._id,
//             orderStatus: "Cash on Delivery",
//         }).save();
//         // update san pham ton kho va da ban
//         let update = userCart.products.map((item) => {
//             return {
//                 updateOne: {
//                     filter: { _id: item.product._id },
//                     update: { $inc: { quantity: -item.count, sold: +item.count } },
//                 },
//             };
//         });
//         const updated = await Product.bulkWrite(update, {}); // cap nhat hang loat san pham trong DB
//         res.json({ message: "success" });
//     } catch (error) {
//         next(error);
//     }
// });

// const getOrderByUserId = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     validateMongoDbId(id);
//     try {
//         const userorders = await Order.findOne({ orderby: id })
//             .populate("products.product")
//             .populate("orderby")
//             .exec();
//         res.json(userorders);
//     } catch (error) {
//         next(error);
//     }
// });

// const updateOrderStatus = asyncHandler(async (req, res) => {
//     const { status } = req.body;
//     const { id } = req.params;
//     validateMongoDbId(id);
//     try {
//         const updateOrderStatus = await Order.findByIdAndUpdate(
//             id,
//             {
//                 orderStatus: status,
//                 paymentIntent: {
//                     status: status,
//                 },
//             },
//             { new: true }
//         );
//         res.json(updateOrderStatus);
//     } catch (error) {
//         next(error);
//     }
// });

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
  saveAddress,


  // applyCoupon,
  // createOrder,
  // getOrderByUserId,
  // updateOrderStatus,
};
