const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A Tour Must Have a Name"],
    unique: true,
    trim : true
  },
  duration: {
    type: Number,
    required: [true, "A Tour Must Have a Duration"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "A Tour Must Have a group size"],
  },
  difficulty: {
    type: String,
    required: [true, "A Tour Must Have a Difficulty"],
  },

  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "A Tour Must Have a Price"],
  },
  priceDiscount : Number,
  summary : {
    type : String,
    trim : true,
    required : [true, 'A Tour Must Have A Summary']
  },
  description :{
    type : String,
    trim : true,
    required : [true, 'A Tour Must Have A Description']
  },
  imageCover : {
    type: String,
    required : [true, 'A Tour Must Have an Image Cover']
  },
  images : [String],
  createdAt : {
    type : Date,
    default : Date.now(),
    select: false
  },
  startDates : [Date]
}); 

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
