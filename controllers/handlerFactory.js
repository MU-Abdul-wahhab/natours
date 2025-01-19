const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const factory = require("./handlerFactory");
const Tour = require("../models/tourModel");

exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) {
            return next(new appError("No Document found with provided ID", 404));
        }

        res.status(204).json({
            status: "Success",
            data: null,
        });
    });

exports.updateOne = Model => catchAsync(async (req, res, next) => {

    const id = req.params.id;
    const document = await Model.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!document) {
        return next(new appError('No Document found with provided ID', 404));
    }

    res.status(200).json({
        status: "Success",
        data: {
            document,
        },
    });
});
exports.createOne = Model => catchAsync(async (req, res, next) => {

    const document = await Model.create(req.body);

    res.status(201).json({
        status: "success",
        data: {
            data: document,
        },
    });
});

exports.readOne = (Model, popOptions) => catchAsync(async (req, res, next) => {})
