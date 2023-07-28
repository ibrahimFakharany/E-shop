const express = require("express");

const router = express.Router();

const { protect } = require("../services/authService");

const {
  createReview,
  getAllReviews,
  getReview,
  updateReview,
  deleteReview,
} = require("../services/reviewService");

router.route("/").post(protect, createReview).get(getAllReviews);

router
  .route("/:id")
  .get(getReview)
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;
