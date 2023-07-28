const express = require("express");

const router = express.Router();

const {
  createCashOrder,
  addFitlerationObject,
  getAllOrders,
  updateOrderPayStatus,
  updateOrderDeliverStatus,
} = require("../services/orderService");
const { protect, allowedTo } = require("../services/authService");

router.use(protect);
router
  .route("/")
  .post(createCashOrder)
  .get(allowedTo("user", "admin"), addFitlerationObject, getAllOrders);
router.route("/:orderId/pay").put(updateOrderPayStatus);
router.route("/:orderId/deliver").put(updateOrderDeliverStatus);
module.exports = router;
