const Coupon = require("../models/couponModel");
const validateMongoDbId = require("../utils/validateMongodbId");
const asynHandler = require("express-async-handler");

const createCoupon = asynHandler(async (req, res, next) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.status(200).json(newCoupon);
  } catch (error) {
    next(error);
  }
});

const getAllCoupons = asynHandler(async (req, res, next) => {
  try {
    const coupons = await Coupon.find().populate("product");
    res.status(200).json(coupons);
  } catch (error) {
    next(error);
  }
});

const updateCoupon = asynHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatecoupon = await Coupon.findOneAndUpdate(
      { product: id },
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(updatecoupon);
  } catch (error) {
    next(error);
  }
});
const deleteCoupon = asynHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletecoupon = await Coupon.findByIdAndDelete(id);
    res.status(200).json(deletecoupon);
  } catch (error) {
    next(error);
  }
});
const getCoupon = asynHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getAcoupon = await Coupon.findOne({ product: id }).populate(
      "product"
    );
    res.status(200).json(getAcoupon);
  } catch (error) {
    next(error);
  }
});

module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  getCoupon,
};
