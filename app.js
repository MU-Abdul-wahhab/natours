const express = require("express");
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');
const appError = require('./utils/appError');

const app = express();

// 1. Middleware starts

if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
};

app.use(express.json());
app.use(express.static(`${__dirname}/public`));


app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//3. Routes Starts 

app.use('/api/v1/tours' , tourRouter);
app.use('/api/v1/users' , userRouter);


//3. Routes Ends

app.all('*' , (req, res, next)=>{
 
  const error = new Error(`Can not find ${req.originalUrl} on this server`);
  error.status = "failed";
  error.statusCode = 404;


  next(new appError(`Can not find ${req.originalUrl} on this server` , 404));
});

app.use(globalErrorHandler);

module.exports =app;