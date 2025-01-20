const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const factory = require("./handlerFactory");
const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeature");

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

exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    const id = req.params.id;
    let query = Model.findById(id);
    if(popOptions) query = query.populate(popOptions);

    const document = await query;

    if (!document) {
        return next(new appError('No document found with provided ID', 404));
    }

    res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        data: {
            document,
        },
    });
})

exports.getAll = Model => catchAsync(async (req, res, next) => {
    let filter = {};
    if(req.params.tourId) filter = {tour : req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query).filter().sort().pagination();
    const document = await features.query;

    res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        data: {
            document,
        },
    });

});
