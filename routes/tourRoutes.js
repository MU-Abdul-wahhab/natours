const express = require("express");
const tourController = require("./../controllers/tourController");
const authController = require("../controllers/authController");
// const reviewController = require("../controllers/reviewController");
const router = express.Router();

const reviewRouter = require("../routes/reviewRoutes");

// router.param('id',tourController.checkID);

router
    .route("/top-5-cheap")
    .get(tourController.aliasTopTours, tourController.getAllTours);
router.route("/monthly-plan/:year").get(authController.protect,
    authController.restrictTo("admin", "lead-guide"), tourController.getMonthlyPlan);

router.route("/tour-stats").get(tourController.getTourStats);
router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin);
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
    .route("/")
    .get(tourController.getAllTours)
    .post(authController.protect, authController.restrictTo('admin', 'lead-guide', 'guide'),
        tourController.createTour);

router
    .route("/:id")
    .get(tourController.getTour)
    .patch(authController.protect,
        authController.restrictTo("admin", "lead-guide"), tourController.updateTour)
    .delete(
        authController.protect,
        authController.restrictTo("admin", "lead-guide"),
        tourController.deleteTour
    );

router.use("/:tourId/reviews", reviewRouter);

module.exports = router;
