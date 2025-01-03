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

    const stats = await Tour.aggregate([
      {
        $match: {
          ratingsAverage: { $gte: 4.5 }
        }
      },
      {
        $group: {
          _id: '$difficulty',
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: {
            $avg: '$ratingsAverage'
          },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        }
      },
      {
        $sort: {
          avgPrice: 1
        }
      }

    ]);

    res.status(200).json({
      status: 'Success',
      data: {
        stats
      }
    })

  } catch (err) {

    res.status(404).json({
      status: 'Fail',
      message: err.message
    });

  }
}

exports.getMonthlyPlan = async (req, res) => {

  try {
      const year = req.params.year * 1;
      const plan = await Tour.aggregate([
        {
          $unwind: '$startDates'
        },
        {
          $match: {
            startDates: {
              $gte : new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`)
            }
          }
        },
        {
          $group:{
            _id: {$month: '$startDates'},
            numTourStarts: {$sum:1},
            tours : {$push: '$name'}
          }
        },
        {
          $addFields: {month: '$_id'}
        },
        {
          $project: {
            _id: 0
          }
        },
        {
          $sort: {numTourStarts: -1}
        },
        // {
        //   $limit: 6
        // }
      ]);

      res.status(200).json({
        status: 'Success',
        data: {
          plan
        }
      })
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err.message
    });
  }
}