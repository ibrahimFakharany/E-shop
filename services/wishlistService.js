const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// @desc   Add product to wishlist
// @route  POST /api/v1/wishlist/
// @access Private
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const result = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );
  res
    .status(200)
    .json({ data: "product added to wishlist", wishlist: result.wishlist });
});

// @desc   Add product to wishlist
// @route  POST /api/v1/wishlist/
// @access Private
exports.deleteProductFromWishlist = asyncHandler(async (req, res, next) => {
  const result = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );
  res
    .status(200)
    .json({ data: "product added to wishlist", wishlist: result.wishlist });
});

exports.getAllWishlist = asyncHandler(async (req, res, next) => {
  const result = await User.findById(req.user._id).populate("wishlist");
  res.status(200).json({ data: result.wishlist });
});
