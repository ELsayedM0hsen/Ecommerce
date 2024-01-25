const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const asyncHandler = require("express-async-handler");

const createOrder = asyncHandler(async (req, res, next) => {
  const {
    itemsPrice,
    shippingPrice,
    totalPrice,
    orderItems,
    paymentMethod,
    paymentInfo,
    shippingInfo,
    isPaid,
    paidAt,
  } = req.body;

  const { _id } = req.user;
  let updateQuantity = true;
  let arrProduct = [];
  try {
    const promises = orderItems.map(async (item) => {
      const product = await Product.findById(item?.product);
      if (product?.quantity < item?.quantity) {
        updateQuantity = false;
        arrProduct.push({
          title: product.title,
          quantity: product.quantity,
        });
      }
      return updateQuantity;
    });

    const results = await Promise.all(promises);

    // console.log("results: ", results);
    // console.log("updateQuantity: ", updateQuantity);
    // console.log("arrProduct: ", arrProduct);

    if (updateQuantity) {
      const createdOrder = await Order.create({
        itemsPrice,
        shippingPrice,
        totalPrice,
        orderItems,
        paymentMethod,
        paymentInfo,
        shippingInfo,
        isPaid,
        paidAt,
        user: _id,
      });

      const updatePromises = orderItems.map(async (item) => {
        const product = await Product.findById(item?.product);
        product.quantity -= item?.quantity;
        product.sold += item?.quantity;
        await product.save();
        return true;
      });

      await Promise.all(updatePromises);

      if (createOrder) {
        res.json({
          createdOrder,
          message: "SUCCESS",
        });
      }
    } else {
      res.json({
        message: "ERR",
        product: arrProduct,
      });
    }
  } catch (error) {
    next(error);
  }
});

const getMyOrders = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  try {
    const orders = await Order.find({ user: _id })
      .populate("user")
      .populate("orderItems.product")
      .populate("orderItems.color")
      .sort("-createdAt");
    res.json({
      orders,
    });
  } catch (error) {
    next(error);
  }
});

const getAllOrders = asyncHandler(async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("orderItems.product")
      .sort("-createdAt");
    res.json({
      orders,
    });
  } catch (error) {
    next(error);
  }
});

const getSingleOrders = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    const singleOrder = await Order.findOne({ _id: id })
      .populate("user")
      .populate("orderItems.product");

    res.json(singleOrder);
  } catch (error) {
    next(error);
  }
});

const updateOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    const orders = await Order.findById(id);
    orders.orderStatus = req.body.status;
    orders.save();
    res.json({
      orders,
    });
  } catch (error) {
    next(error);
  }
});

const cancelOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { orderItems } = req.body;
  try {
    const cancelAOrder = await Order.findByIdAndUpdate(id, {
      orderStatus: "Cancelled",
    });

    const updatePromises = orderItems.map(async (item) => {
      const product = await Product.findById(item?.product._id);
      product.quantity += item?.quantity;
      product.sold -= item?.quantity;
      await product.save();
      return true;
    });

    await Promise.all(updatePromises);

    res.json({
      cancelAOrder,
    });
  } catch (error) {
    next(error);
  }
});

const deleteOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);

    const updatePromises = order?.orderItems?.map(async (item) => {
      const product = await Product.findById(item?.product._id);
      product.quantity += item?.quantity;
      product.sold -= item?.quantity;
      await product.save();
      return true;
    });

    await Promise.all(updatePromises);

    const deleteAOrder = await Order.findByIdAndDelete(id);
    res.json({
      deleteAOrder,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getSingleOrders,
  updateOrder,
  cancelOrder,
  deleteOrder,
};
