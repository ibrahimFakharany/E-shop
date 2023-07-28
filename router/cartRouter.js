const express = require("express");

const router = express.Router();

const {
  addProductToCart,
  getAllCartItems,
  removeItemFromCart,
  deleteUserCart,
  udpateCartItemQuantity,
  applyCoupon,
} = require("../services/cartService");
const { protect, allowedTo } = require("../services/authService");

router.use(protect, allowedTo("user"));
router
  .route("/")
  .post(addProductToCart)
  .get(getAllCartItems)
  .delete(deleteUserCart);
router.route("/:itemId").delete(removeItemFromCart).put(udpateCartItemQuantity);
router.route("/applyCoupon").post(applyCoupon);
module.exports = router;
