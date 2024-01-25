const Color = require("../models/colorModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createColor = asyncHandler(async (req, res, next) => {
  try {
    const newColor = await Color.create(req.body);
    res.status(200).json(newColor);
  } catch (error) {
    next(error);
  }
});
const updateColor = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatedColor = await Color.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedColor);
  } catch (error) {
    next(error);
  }
});
const deleteColor = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedColor = await Color.findByIdAndDelete(id);
    res.status(200).json(deletedColor);
  } catch (error) {
    next(error);
  }
});
const getColor = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaColor = await Color.findById(id);
    res.status(200).json(getaColor);
  } catch (error) {
    next(error);
  }
});
const getallColor = asyncHandler(async (req, res, next) => {
  try {
    const getallColor = await Color.find();
    res.status(200).json(getallColor);
  } catch (error) {
    next(error);
  }
});
module.exports = {
  createColor,
  updateColor,
  deleteColor,
  getColor,
  getallColor,
};
