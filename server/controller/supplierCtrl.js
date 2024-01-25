const Supplier = require("../models/supplierModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createSupplier = asyncHandler(async (req, res,next) => {
    try {
        const newSupplier = await Supplier.create(req.body);
        res.status(201).json(newSupplier);
    } catch (error) {
        next(error);
    }
});

const updateSupplier = asyncHandler(async (req, res,next) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatedSupplier = await Supplier.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.status(200).json(updatedSupplier);
    } catch (error) {
        next(error);
    }
});
const deleteSupplier = asyncHandler(async (req, res,next) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedSupplier = await Supplier.findByIdAndDelete(id);
        res.status(200).json(deletedSupplier);
    } catch (error) {
        next(error);
    }
});

const getSupplier = asyncHandler(async (req, res,next) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getaSupplier = await Supplier.findById(id);
        res.status(200).json(getaSupplier);
    } catch (error) {
        next(error);
    }
});
const getallSupplier = asyncHandler(async (req, res,next) => {
    try {
        const getallSupplier = await Supplier.find();
        res.status(200).json(getallSupplier);
    } catch (error) {
        next(error);
    }
});

module.exports = {
    createSupplier,
    updateSupplier,
    deleteSupplier,
    getSupplier,
    getallSupplier
}