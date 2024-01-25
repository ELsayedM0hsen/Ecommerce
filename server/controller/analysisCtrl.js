const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const asyncHandler = require("express-async-handler");

const getMonthWiseOrderIncome = asyncHandler(async (req, res, next) => {
  let monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  d = new Date();
  let endDate = "";
  d.setDate(1);
  for (let index = 0; index < 11; index++) {
    d.setMonth(d.getMonth() - 1);
    endDate = monthNames[d.getMonth()] + " " + d.getFullYear();
  }
  const data = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $lte: new Date(),
          $gte: new Date(endDate),
        },
        orderStatus: { $ne: "Cancelled" },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
        },
        amount: { $sum: "$totalPrice" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        "_id.month": 1,
      },
    },
  ]);
  res.json(data);
});

const getYearlyTotalOrders = asyncHandler(async (req, res, next) => {
  let monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  d = new Date();
  let endDate = "";
  d.setDate(1);
  for (let index = 0; index < 11; index++) {
    d.setMonth(d.getMonth() - 1);
    endDate = monthNames[d.getMonth()] + " " + d.getFullYear();
  }
  // console.log(endDate)
  const data = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $lte: new Date(),
          $gte: new Date(endDate),
        },
        orderStatus: { $ne: "Cancelled" },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
        },
        count: { $sum: 1 },
        amount: { $sum: "$totalPrice" },
      },
    },
    {
      $sort: {
        "_id.year": 1,
      },
    },
  ]);
  res.json(data);
});

const countLowStockProducts = asyncHandler(async (req, res, next) => {
  try {
    const lowStockProductsCount = await Product.aggregate([
      {
        $match: {
          quantity: { $lte: 15 },
        },
      },
      {
        $count: "lowStockCount",
      },
    ]);

    const count =
      lowStockProductsCount.length > 0
        ? lowStockProductsCount[0].lowStockCount
        : 0;

    res.json(count);
  } catch (error) {
    next(error);
  }
});

const calculateCategoryRevenue = asyncHandler(async (req, res, next) => {
  try {
    const categoryRevenue = await Order.aggregate([
      {
        $match: {
          orderStatus: { $ne: "Cancelled" },
        },
      },
      {
        $unwind: "$orderItems",
      },
      {
        $lookup: {
          from: "products",
          localField: "orderItems.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $group: {
          _id: "$productDetails.category",
          totalRevenue: { $sum: "$orderItems.priceAfterDiscount" },
        },
      },
      {
        $sort: {
          totalRevenue: -1,
        },
      },
    ]);

    res.json(categoryRevenue);
  } catch (error) {
    next(error);
  }
});

const inventoryStatsByCategory = asyncHandler(async (req, res) => {
  try {
    const inventoryStats = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $sort: {
          totalQuantity: 1,
        },
      },
    ]);

    res.json(inventoryStats);
  } catch (error) {
    next(error);
  }
});

const getOrderStatusCounts = asyncHandler(async (req, res) => {
  try {
    const orderStatusCounts = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);

    res.json(orderStatusCounts);
  } catch (error) {
    console.error(error);
  }
});

const getPaymentMethodCounts = asyncHandler(async (req, res) => {
  try {
    const paymentMethodCounts = await Order.aggregate([
      {
        $match: {
          orderStatus: { $ne: "Cancelled" },
        },
      },
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);

    res.json(paymentMethodCounts);
  } catch (error) {
    console.error(error);
  }
});

module.exports = {
  getMonthWiseOrderIncome,
  getYearlyTotalOrders,
  calculateCategoryRevenue,
  getOrderStatusCounts,
  getPaymentMethodCounts,
  countLowStockProducts,
  inventoryStatsByCategory,
};
