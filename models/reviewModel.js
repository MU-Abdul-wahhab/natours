const mongoose = require("mongoose");
const Tour = require("./tourModel");

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, "Review can not be Empty"],
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: "Tour",
            required: [true, "Review Must Belong To A Tour"],
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [true, "Review Must Belong to A user"],
        },
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

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select: "name photo",
    });

    next();
});

reviewSchema.index({tour : 1, user: 1}, {unique: true});

reviewSchema.statics.calAverageRatings = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: {tour: tourId}
        },
        {
            $group: {
                _id: '$tour',
                nRatings: {$sum: 1},
                averageRatings: {$average: '$rating'},
            }
        }
    ]);
    console.log(stats);

    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRatings,
            ratingsAverage: stats[0].averageRatings
        })
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        })
    }

};

reviewSchema.post('save', function () {
    this.constructor.calAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
    const r = await this.findOne()
    console.log(r);
    next();
});

reviewSchema.post(/^findOneAnd/, async function () {
    await this.r.constructor.calAverageRatings(this.r.tour);
})

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
