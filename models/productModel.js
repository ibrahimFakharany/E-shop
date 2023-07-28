const mongo = require("mongoose");

const productSchema = mongo.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      minlength: [3, "too short product title"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
      maxlength: [2000, "too long description"],
    },
    slug: { type: String, lowercase: true },
    quantity: { type: Number, required: [true, "quantity is required"] },
    sold: { type: Number, default: 0 },
    price: {
      type: Number,
      required: [true, "quantity is required"],
      max: [2000000, "price is too high"],
    },
    priceAfterDiscount: { type: Number, max: [2000000, "price is too high"] },
    colors: [String],
    coverImage: { type: String, required: [true, "cover image is required"] },
    images: [String],
    category: {
      type: mongo.Schema.ObjectId,
      ref: "category",
      required: [true, "category is required"],
    },
    subCategories: [{ type: mongo.Schema.ObjectId, ref: "subcategory" }],
    brand: {
      type: mongo.Schema.ObjectId,
      ref: "brand",
    },
    ratingAvg: {
      type: Number,
      min: [1, "average ratings must be above 1.0"],
      max: [5, "average ratings must be below 5"],
    },
    ratingQuantity: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual("reviews", {
  ref: "review",
  foreignField: "product",
  localField: "_id",
});

productSchema.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "name -_id" });
  next();
});
const setImageURL = (doc) => {
  if (doc.coverImage) {
    const newURL = `${process.env.BASE_URL}/products/${doc.coverImage}`;
    doc.coverImage = newURL;
  }
  if (doc.images) {
    const newImagesURL = [];
    doc.images.forEach((val) => {
      newImagesURL.push(`${process.env.BASE_URL}/products/${val}`);
    });

    doc.images = newImagesURL;
  }
};
productSchema.post("init", (doc) => {
  setImageURL(doc);
});

productSchema.post("save", (doc) => {
  setImageURL(doc);
});
const ProductModel = mongo.model("product", productSchema);

module.exports = ProductModel;
