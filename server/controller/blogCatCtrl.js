const Category = require("../models/blogCatModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createCategory = asyncHandler(async (req, res,next) => {
    try {
        const newCategory = await Category.create(req.body);
        res.status(201).json(newCategory);
    } catch (error) {
        next(error);
    }
});

const updateCategory = asyncHandler(async (req, res,next) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.status(200).json(updatedCategory);
    } catch (error) {
        next(error);
    }
});
const deleteCategory = asyncHandler(async (req, res,next) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedCategory = await Category.findByIdAndDelete(id);
        res.status(200).json(deletedCategory);
    } catch (error) {
        next(error);
    }
});

const getCategory = asyncHandler(async (req, res,next) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getaCategory = await Category.findById(id);
        res.status(200).json(getaCategory);
    } catch (error) {
        next(error);
    }
});
const getallCategory = asyncHandler(async (req, res,next) => {
    try {
        const getallCategory = await Category.find();
        res.status(200).json(getallCategory);
    } catch (error) {
        next(error);
    }
});

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getallCategory
}