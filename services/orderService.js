const stripe = require("stripe")(process.env.STRIPE_SECRETE);
const asyncHandler = require("express-async-handler");
const orderModel = require("../models/orderModel");
const cartModel = require("../models/cartModel");
const ProductModel = require("../models/productModel");
const { getAll } = require("./handlerFactory");
const AppError = require("../utils/appError");

// @DESC   create cash cart
// @route  POST api/v1/orders/cartId
// @access private for user
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  // this will come from app setting module
  const taxPrice = 0;
  const shippingPrice = 0;
  // get cart by cartId
  const userCart = await cartModel.findOne({ user: req.user._id });

  // create order by this cart

  const price = userCart.totalPriceAfterDiscount
    ? userCart.totalPriceAfterDiscount
    : userCart.totalPrice + taxPrice + shippingPrice;
  const order = await orderModel.create({
    user: userCart.user,
    cartItems: userCart.cartItems,
    taxPrice: taxPrice,
    shippingPrice: shippingPrice,
    totalPrice: price,
  });
  if (order) {
    // update quantity of products
    const bulkOptions = userCart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await ProductModel.bulkWrite(bulkOptions, {});
    await cartModel.findByIdAndDelete(userCart._id);
    // delete cart

    res.status(201).json({ order });
  }
  res.status(400).json({ message: "order could not craeted " });
});
// @DESC   Get all orders
// @route  GET api/v1/orders/
// @access private get all orders
exports.getAllOrders = getAll(orderModel);

exports.addFitlerationObject = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterOptions = { user: req.user._id };
  next();
});

// @DESC   update order status
// @route  POST api/v1/orders/:orderId/pay
// @access private update order status for admin
exports.updateOrderPayStatus = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findById(req.params.orderId);
  if (!order) {
    return next(new AppError("order not found"));
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  await order.save();
  res.status(200).json({ order });
});

// @DESC   update delivered Status
// @route  POST api/v1/orders/:orderId/deliver
// @access private update order status for admin
exports.updateOrderDeliverStatus = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findById(req.params.orderId);
  if (!order) {
    return next(new AppError("order not found"));
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  await order.save();
  res.status(200).json({ order });
});

// @DESC   Create stripe checkout session
// @route  POST api/v1/checkout-session/:cartId
// @access protected(user)
exports.createCheckoutSession = asyncHandler(async (req, res, next) => {
  const totalPrice = 0;
  const shippingPrice = 0;

  const cart = await cartModel.findById(req.params.cartId);
  if (!cart) return next(new AppError("there is no cart for this id"));
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;

  const totalOrderPrice = cartPrice + totalPrice + shippingPrice;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        amount: totalOrderPrice * 100,
        name: req.user.name,
        currency: "egp",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}/${req.get("host")}/orders`,
    cancel_url: `${req.protocol}/${req.get("host")}/cart`,
  });
});
