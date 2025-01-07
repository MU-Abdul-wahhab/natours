const appError = require('../utils/appError');

const handleDbCastError = err =>{
  const message = `Invalid ${err.path}: ${err.value}`;

  return new appError(message, 400);
}

const handleDbDuplicateFields = err =>{
  const message = `Duplicate Field value`;
  return new appError(message, 400)
}

const handleValidationDbError = err =>{
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid Input Data ${errors.join('. ')}`; 
  return new appError(message, 400);
}

const handleJwtError = () => new appError('Invalid Token. Please login again' , 401);

const handleTokenExpiredError = () => new appError('Your Token Has Been Expired' , 401);

const sendErrorDev = (err, res) =>{
  res.status(err.statusCode).json({
    status: err.status,
    error : err,
    message: err.message,
    stack : err.stack
  });
};

const sendErrorProduction = (err, res)=>{
 if(err.isOperational){
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
 }else{
  console.error(err);
  res.status(500).json({
    status: 'Error',
    message: 'Something went wrong',
  })
 }
}

module.exports = (err, req, res, next) => {
  console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV == 'development') {
    sendErrorDev(err , res);
  } else if (process.env.NODE_ENV == 'production') {
    let error = {...err};

    if(err.name === 'CastError'){
      error = handleDbCastError(error);
    }

    if(err.code === 11000){
      error = handleDbDuplicateFields(error);
    }

    if(err.name === 'ValidationError'){
      error = handleValidationDbError(err);
    }

    if(err.name === 'JsonWebTokenError'){
      error = handleJwtError();
    }

    if(err.name === 'TokenExpiredError'){
      error = handleTokenExpiredError();
    }

    sendErrorProduction(error, res);
  }
}