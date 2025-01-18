const express = require("express");
const morgan = require("morgan");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const globalErrorHandler = require("./controllers/errorController");
const appError = require("./utils/appError");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const { whitelist } = require("validator");

const app = express();
app.use(helmet());
// 1. Middleware starts

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too Many Request From this IP. Please try again in an hour",
});

app.use("/api", limiter);

app.use(
  express.json({
    limit: "10kb",
  })
);

app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "average",
      "msxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//3. Routes Starts

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

//3. Routes Ends

app.all("*", (req, res, next) => {
  const error = new Error(`Can not find ${req.originalUrl} on this server`);
  error.status = "failed";
  error.statusCode = 404;

  next(new appError(`Can not find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
