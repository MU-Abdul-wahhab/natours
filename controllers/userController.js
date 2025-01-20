const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields)=>{
  const newObj = {};
  Object.keys(obj).forEach(el =>{
    if(allowedFields.includes(el)){
      newObj[el] = obj[el];
    }
  });

  return newObj;

}

exports.getAllUsers =factory.getAll(User);

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined yet",
  });
};

exports.getUser = factory.getOne(User);

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new appError("This Route is not for update the password", 400));
  }

  const filteredBody = filterObj(req.body, 'name', 'email');

  const updateUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data :{
      user : updateUser
    }
  });
});

exports.deleteMe = catchAsync(async(req, res, next) =>{

await User.findByIdAndUpdate(req.user._id, {active : false});

res.status(204).json({
  status : 'sucess',
  data : null
})

});

exports.getMe =  (req, res, next) =>{
  req.params.id = req.user.id;
  next();
}