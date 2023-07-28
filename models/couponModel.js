const mongo = require("mongoose");

const couponSchema = mongo.Schema(
  {
    name: {
      type: String,
      unique: [true, "name is unique"],
      trim: true,
      require: [true, "name is required"],
      uppercase: true,
    },
    expire: {
      type: Date,
      require: [true, "expire date is required"],
    },
    discount: {
      type: Number,
      required: [true, "coupon discount is required"],
    },
  },
  { timestamps: true }
);

const CouponModel = mongo.model("coupon", couponSchema);
module.exports = CouponModel;
