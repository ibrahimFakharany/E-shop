const mongo = require("mongoose");

const cartSchema = mongo.Schema(
  {
    cartItems: [
      {
        product: { type: mongo.Schema.ObjectId, ref: "product" },
        color: String,
        price: Number,
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    user: { type: mongo.Schema.ObjectId, ref: "user" },
    totalPrice: Number,
    totalPriceAfterDiscount: Number,
  },
  { timestamps: true }
);

const cartModel = mongo.model("cart", cartSchema);
module.exports = cartModel;
