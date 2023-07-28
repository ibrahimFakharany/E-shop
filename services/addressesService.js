const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

// @desc   Add Address
// @route  POST /api/v1/addresses/
// @access Private
exports.addAddress = asyncHandler(async (req, res, next) => {
  const result = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { address: req.body },
    },
    { new: true }
  );
  res.status(200).json({ data: "Address added", addresses: result.address });
});

// @desc   remove address
// @route  DELETE /api/v1/addresses/:addressId
// @access Private
exports.removeAddress = asyncHandler(async (req, res, next) => {
  const result = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { address: { _id: req.params.addressId } },
    },
    { new: true }
  );
  if (!result) return next(new AppError("Address not found"));
  res.status(204).json({ data: "AddressRemoved" });
});

// @desc   Get all address
// @route  GET /api/v1/addresses/
// @access Private
exports.getAllAddresses = asyncHandler(async (req, res, next) => {
  const result = await User.findById(req.user._id).select("address");
  res.status(200).json({ data: result });
});
