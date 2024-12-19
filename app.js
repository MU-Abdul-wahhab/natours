const express = require("express");
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1. Middleware starts

if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));


app.use((req, res, next) => {
  console.log("hello from the middleware");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 1. Middleware Ends

// 2. Route Handlers Starts

// 2. Route Handlers Ends



//3. Routes Starts 

app.use('/api/v1/tours' , tourRouter);
app.use('/api/v1/users' , userRouter);


//3. Routes Ends

module.exports =app;