const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
const User = require("./userModel");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A Tour Must Have a Name"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must have less or equal than 40 characters"],
      minlength: [10, "A tour name must have more or equal than 10 characters"],
      // validate: [validator.isAlpha , 'Tour Name Must Only Contain Characters']
    },
    slug: String,
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
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium or difficult",
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be belowe 5.0"],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A Tour Must Have a Price"],
    },
    priceDiscount: {
      type: Number,
      valiate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "Discount Price ({VALUE}) Should be below regular price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A Tour Must Have A Summary"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "A Tour Must Have A Description"],
    },
    imageCover: {
      type: String,
      required: [true, "A Tour Must Have an Image Cover"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// tourSchema.pre('save', function(next){
//   this.slug = slugify(this.name , {lower : true});
//   next();
// });

// tourSchema.post('save', function(doc, next){
//   console.log(doc);
// });

// tourSchema.pre(/^find/, function (next) {
//   this.find({ secretaTour: { $ne: true } })
//   next();
// });

// tourSchema.post(/^find/ , function(doc, next){
//   console.log(`Query rook ${Date.now() - this.start} milliseconds!`);
//   console.log(doc);
//   next();
// });

// tourSchema.post('save', async function(next){

// const guidesPromises = this.guides.map(async id => await User.findById(id));
// this.guides = await Promises.all(guidesPromises);

//   next();
// });

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
