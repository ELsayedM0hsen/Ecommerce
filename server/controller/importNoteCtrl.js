const ImportNote = require("../models/importNoteModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createImportNote = asyncHandler(async (req, res,next) => {
    try {
        const newImportNote = await ImportNote.create(req.body);
        res.status(200).json(newImportNote);
    } catch (error) {
        next(error);;
    }
});

const updateImportNote = asyncHandler(async (req, res,next) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatedImportNote = await ImportNote.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.status(200).json(updatedImportNote);
    } catch (error) {
        next(error);;
    }
});
const deleteImportNote = asyncHandler(async (req, res,next) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedImportNote = await ImportNote.findByIdAndDelete(id);
        res.status(200).json(deletedImportNote);
    } catch (error) {
        next(error);;
    }
});

const getImportNote = asyncHandler(async (req, res,next) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getaImportNote = await ImportNote.findById(id);
        res.status(200).json(getaImportNote);
    } catch (error) {
        next(error);;
    }
});
const getallImportNote = asyncHandler(async (req, res,next) => {
    try {
        const getallImportNote = await ImportNote.find().populate("nameSupplier");
        res.status(200).json(getallImportNote);
    } catch (error) {
        next(error);;
    }
});

module.exports = {
    createImportNote,
    updateImportNote,
    deleteImportNote,
    getImportNote,
    getallImportNote
}