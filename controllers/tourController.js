const Tour = require("./../models/tourModel");
const APIFeatures = require('../utils/apiFeature');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');

exports.aliasTopTours = (req, res, next) => {

  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price',
    req.query.fields = 'name,price.ratingAverage,summary,difficulty'
  next();

}

exports.createTour = catchAsync(async (req, res, next) => {
 
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
});

exports.getAllTours = catchAsync(async (req, res, next) => {

  const features = new APIFeatures(Tour.find(), req.query).filter().sort().pagination();
  const tours = await features.query;

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    data: {
      tours,
    },
  });

});

exports.getTour = catchAsync(async (req, res, next) => {

  const id = req.params.id;
  const tour = await Tour.findById(id);

  if(!tour){
   return next(new appError('No Tour found with provided ID' , 404));
  }

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    data: {
      tour,
    },
  });
}
);

exports.updateTour = catchAsync(async (req, res, next) => {

  const id = req.params.id;
  const tour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if(!tour){
    return next(new appError('No Tour found with provided ID' , 404));
   }
   
  res.status(200).json({
    status: "Success",
    data: {
      tour,
    },
  });
});

exports.deletTour = catchAsync(async (req, res, next) => {

 const tour = await Tour.findByIdAndDelete(req.params.id);

  if(!tour){
    return next(new appError('No Tour found with provided ID' , 404));
   }

  res.status(204).json({
    status: "Success",
    data: null,
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {

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

});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {

    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numTourStarts: -1 }
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
    });
});