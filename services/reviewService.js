const asyncHandler = require("express-async-handler");
const ReviewModel = require("../models/reviewModel");

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactory");

// @desc   Create new review
// @route  POST /api/v1/reviews/
// @access Private for user
exports.createReview = createOne(ReviewModel);

// @desc   Get all reviews
// @route  GET /api/v1/reviews
// @access Public
exports.getAllReviews = getAll(ReviewModel);

// @desc   Get single review
// @route  GET /api/v1/reviews/:id
// @access Public 
exports.getReview = getOne(ReviewModel);

// @desc   Update single review
// @route  PUT /api/v1/reviews/:id
// @access Private for user
exports.updateReview = updateOne(ReviewModel);

// @desc   Delete single review
// @route  DELETE /api/v1/reviews/:id
// @access Private (for user, admin)
exports.deleteReview = deleteOne(ReviewModel);
