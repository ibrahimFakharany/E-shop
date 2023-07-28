const express = require("express");

const router = express.Router();

const { protect, allowedTo } = require("../services/authService");

const {
  createCoupon,
  deleteCoupon,
  updateCoupon,
  getCoupon,
  getAllCoupons,
} = require("../services/couponService");

router.use(protect, allowedTo("admin", "user"));
router.route("/").post(createCoupon).get(getAllCoupons);

router.route("/:id").get(getCoupon).put(updateCoupon).delete(deleteCoupon);

module.exports = router;
