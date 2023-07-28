const mongo = require("mongoose");
const productModel = require("./productModel");

const reviewSchema = mongo.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
    },
    ratings: {
      type: Number,
      min: [1, "min length is 1.0"],
      max: [5, "min length is 5.0"],
      required: [true, "ratings is required"],
    },
    user: {
      type: mongo.Schema.ObjectId,
      ref: "users",
      required: [true, "required field"],
    },
    product: {
      type: mongo.Schema.ObjectId,
      ref: "product",
      required: [true, "product is required"],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

reviewSchema.statics.calcAvgRatingsAndQuantity = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "product",
        avgRatings: { $avg: "$ratings" },
        quantity: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await productModel.findByIdAndUpdate(productId, {
      ratingAvg: result[0].avgRatings,
      ratingQuantity: result[0].quantity,
    });
  } else {
    await productModel.findByIdAndUpdate(productId, {
      ratingAvg: 0,
      ratingQuantity: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAvgRatingsAndQuantity(this.product);
});

reviewSchema.post("remove", async function () {
  await this.constructor.calcAvgRatingsAndQuantity(this.product);
});
const reviewModel = mongo.model("review", reviewSchema);
module.exports = reviewModel;
