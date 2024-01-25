const Brand = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createBrand = asyncHandler(async (req, res, next) => {
  try {
    const newBrand = await Brand.create(req.body);
    res.status(200).json(newBrand);
  } catch (error) {
    next(error);
  }
});

const updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedBrand);
  } catch (error) {
    next(error);
  }
});
const deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedBrand = await Brand.findByIdAndDelete(id);
    res.status(200).json(deletedBrand);
  } catch (error) {
    next(error);
  }
});

const getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaBrand = await Brand.findById(id);
    res.status(200).json(getaBrand);
  } catch (error) {
    next(error);
  }
});
const getallBrand = asyncHandler(async (req, res, next) => {
  try {
    const getallBrand = await Brand.find();
    res.status(200).json(getallBrand);
  } catch (error) {
    next(error);
  }
});

module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getallBrand,
};
