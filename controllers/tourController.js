const Tour = require("./../models/tourModel");

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/tours-simple.json`)
// );

// exports.checkID = (req, res, next, val) => {
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: "Failed",
//       message: "Invalid ID",
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next)=>{

//   if(!req.body.name || !req.body.price){
//     return res.status(400).json({
//       status: 'Fail',
//       message : 'Missing name or price'
//     })
//   }
//   next();

// }

exports.getAllTours = async (req, res) => {
  try {

    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fileds'];
    excludedFields.forEach(el => delete queryObj[el])

    // console.log(req.query, queryObj);

    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    // console.log('============================================')
    // console.log(JSON.parse(queryString));

    let query = Tour.find(JSON.parse(queryString));
    // console.log(req.query);

    if(req.query.sort){
      const sortBy = req.query.sort.split(',').join(' ');
      console.log(sortBy);
      query = query.sort(sortBy)
    }else{
      query = query.sort('-createdAt')
    }

    if(req.query.fields){
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
      console.log(fields);
      // console.log('object');
    }else{
      query = query.select('-__v')
    }

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 2;
    const skip = (page -1) * limit;

    query = query.skip(skip).limit(limit);

    if(req.query.page){
      const numTours = await Tour.countDocuments();
      if(skip >= numTours){
        throw new Error('This Page Does not Exist');
      }
    }

    const tours = await query;

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
