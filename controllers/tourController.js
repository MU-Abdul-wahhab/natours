const Tour = require("./../models/tourModel");
const APIFeatures = require('../utils/apiFeature');

exports.aliasTopTours = (req, res, next) => {

  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price',
    req.query.fields = 'name,price.ratingAverage,summary,difficulty'
  next();

}

exports.getAllTours = async (req, res) => {
  try {

    const features = new APIFeatures(Tour.find(), req.query).filter().sort().pagination();
    const tours = await features.query;

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getTour = async (req, res) => {
  const id = req.params.id;

  try {
    const tour = await Tour.findById(id);
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }

  // res.status(200).json({
  //   status: "success",
  //   tour,
  // });
};

exports.createTour = async (req, res) => {
  // console.log(req.body);

  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: "Failed",
      message: e.message,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const id = req.params.id;

    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "Success",
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.deletTour = async (req, res) => {
  try {

    await Tour.findByIdAndDelete(req.params.id)

    res.status(204).json({
      status: "Success",
      data: null,
    });
  } catch (error) {
    res.status(204).json({
      status: "failed",
      message: 'SOmething went wrong',
    });
  }
};


exports.getTourStats = async (req, res) => {
  try {

    const stats = Tour.aggregate([
      
    ]);

  } catch (err) {

    res.status(404).json({
      status: 'Fail',
      message: err.message
    });

  }
}