const Enquiry = require("../models/enqModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createEnquiry = asyncHandler(async (req, res, next) => {
  try {
    const newEnquiry = await Enquiry.create(req.body);
    res.status(200).json(newEnquiry);
  } catch (error) {
    next(error);
  }
});
const updateEnquiry = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedEnquiry);
  } catch (error) {
    next(error);
  }
});
const deleteEnquiry = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedEnquiry = await Enquiry.findByIdAndDelete(id);
    res.status(200).json(deletedEnquiry);
  } catch (error) {
    next(error);
  }
});
const getEnquiry = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaEnquiry = await Enquiry.findById(id);
    res.status(200).json(getaEnquiry);
  } catch (error) {
    next(error);
  }
});
const getallEnquiry = asyncHandler(async (req, res, next) => {
  try {
    const getallEnquiry = await Enquiry.find();
    res.status(200).json(getallEnquiry);
  } catch (error) {
    next(error);
  }
});
module.exports = {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiry,
  getallEnquiry,
};
