const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const userCart = asyncHandler(async (req, res, next) => {
  const { productId, color, quantity, price, priceAfterDiscount } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    let newCart = await new Cart({
      userId: _id,
      productId,
      color,
      quantity,
      price,
      priceAfterDiscount,
    }).save();
    res.json(newCart);
  } catch (error) {
    next(error);
  }
});

// get all cart of user
const getUserCart = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const cart = await Cart.find({ userId: _id })
      .populate("productId")
      .populate("color");
    res.json(cart);
  } catch (error) {
    next(error);
  }
});

// delete a product in cart
const removeProductFromCart = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const { cartItemId } = req.params;
  validateMongoDbId(_id);
  try {
    const deleteProductFromCart = await Cart.deleteOne({
      userId: _id,
      _id: cartItemId,
    });
    res.json(deleteProductFromCart);
  } catch (error) {
    next(error);
  }
});

const emptyCart = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const deleteCart = await Cart.deleteMany({ userId: _id });
    res.json(deleteCart);
  } catch (error) {
    next(error);
  }
});

const updateProductQuantityFromCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { cartItemId, newQuantity } = req.params;
  validateMongoDbId(_id);
  let updateQuantity = true;
  try {
    const cartItem = await Cart.findOne({ userId: _id, _id: cartItemId });

    const product = await Product.findById(cartItem?.productId);
    if (product?.quantity < newQuantity) {
      updateQuantity = false;
    }
    if (updateQuantity) {
      cartItem.quantity = newQuantity;
      cartItem.save();
      res.json({
        cartItem,
        message: "SUCCESS",
      });
    } else {
      res.json({
        message: "ERR",
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = {
  userCart,
  getUserCart,
  removeProductFromCart,
  updateProductQuantityFromCart,
  emptyCart,
};
