const CouponModel = require("../models/couponModel");

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactory");

// @desc   Create new coupon
// @route  POST /api/v1/coupons/
// @access Private for admin and manager
exports.createCoupon = createOne(CouponModel);

// @desc   Get all coupons
// @route  GET /api/v1/coupons
// @access Private for admin and manager
exports.getAllCoupons = getAll(CouponModel);

// @desc   Get single coupon
// @route  GET /api/v1/coupons/:id
// @access Private for admin and manager
exports.getCoupon = getOne(CouponModel);

// @desc   Update single coupon
// @route  PUT /api/v1/coupons/:id
// @access Private for admin and manager
exports.updateCoupon = updateOne(CouponModel);

// @desc   Delete single coupon
// @route  DELETE /api/v1/coupons/:id
// @access Private (for manager, admin)
exports.deleteCoupon = deleteOne(CouponModel);
