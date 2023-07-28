const mongo = require("mongoose");

const orderSchema = mongo.Schema(
  {
    user: {
      type: mongo.Schema.ObjectId,
      ref: "users",
    },
    cartItems: [
      {
        product: { type: mongo.Schema.ObjectId, ref: "product" },
        color: String,
        price: Number,
        quantity: Number,
      },
    ],
    taxPrice: { type: Number, default: 0 },
    shippingPrice: { type: Number, default: 0 },
    totalPrice: { type: Number },
    paymentMethodType: {
      type: String,
      enum: ["cash", "card"],
      default: "cash",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
    paidAt: Date,
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name image" }).populate({
    path: "cartItems.product",
    select: "title coverImage",
  });
  next();
});
const orderModel = mongo.model("order", orderSchema);
module.exports = orderModel;
