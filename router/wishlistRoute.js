const express = require("express");

const router = express.Router();

const {
  addProductToWishlist,
  deleteProductFromWishlist,
  getAllWishlist,
} = require("../services/wishlistService");
const { protect } = require("../services/authService");

router.use(protect);
router.route("/").post(addProductToWishlist).get(getAllWishlist);
router.route("/:id").delete(deleteProductFromWishlist);

module.exports = router;
