const asyncHandler = require("express-async-handler");
const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const AppError = require("../utils/appError");
const CouponModel = require("../models/couponModel");

const calcTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalPriceAfterDiscount = undefined;
  cart.totalPrice = totalPrice;
};
// @desc   Add product to cart
// @route  POST /api/v1/cart/
// @access Private(for user only)
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const product = await productModel.findById(req.body.productId);

  let cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    cart = await cartModel.create({
      user: req.user.id,
      cartItems: [
        {
          product: req.body.productId,
          price: product.price,
          color: req.body.color,
        },
      ],
    });
  } else {
    const index = await cart.cartItems.findIndex(
      (item) =>
        item.product.toString() === req.body.productId.toString() &&
        item.color === req.body.color
    );
    if (index > -1) {
      const returnedProduct = cart.cartItems[index];
      returnedProduct.quantity += 1;
      cart.cartItems[index] = returnedProduct;
    } else {
      cart.cartItems.push({
        product: req.body.productId,
        price: product.price,
        color: req.body.color,
      });
    }
    calcTotalPrice(cart);
    await cart.save();
    res.status(200).json({ cart });
  }
});

// @desc   Get All cart items
// @route  GET /api/v1/cart/
// @access Private(for user only)
exports.getAllCartItems = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError("no cart for this user"));
  }
  res.status(200).json({ numberOfItemsInCart: cart.cartItems.length, cart });
});

// @desc   Remove item from cart
// @route  GET /api/v1/cart/:itemId
// @access Private(for user only)
exports.removeItemFromCart = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );

  if (!cart) {
    return next(new AppError("no cart for this user"));
  }
  calcTotalPrice(cart);
  await cart.save();
  res.status(200).json({ numberOfItemsInCart: cart.cartItems.length, cart });
});

// @desc   Clear user cart
// @route  DELETE /api/v1/cart/
// @access Private(for user only)
exports.deleteUserCart = asyncHandler(async (req, res, next) => {
  await cartModel.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

// @desc   update cart item quantity
// @route  GET /api/v1/cart/:itemId
// @access Private(for user only)
exports.udpateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const { itemId } = req.params;
  const cart = await cartModel.findOne({ user: req.user._id });

  if (!cart) {
    return next(new AppError("no cart for this user"));
  }

  const index = cart.cartItems.findIndex(
    (item) => item._id.toString() === itemId
  );
  if (index > -1) {
    const item = cart.cartItems[index];
    item.quantity = quantity;
  } else {
    return next(new AppError("no item found with this id", 404));
  }

  calcTotalPrice(cart);
  await cart.save();
  res.status(200).json({ numberOfItemsInCart: cart.cartItems.length, cart });
});

// @desc   apply coupon
// @route  GET /api/v1/cart/applyCoupon
// @access Private(for user only)
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await CouponModel.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  console.log(coupon.discount);

  const cart = await cartModel.findOne({ user: req.user._id });

  calcTotalPrice(cart);
  cart.totalPriceAfterDiscount = (
    cart.totalPrice -
    (cart.totalPrice * 10) / 100
  ).toFixed(2);
  await cart.save();
  res.status(200).json({ cart });
});
