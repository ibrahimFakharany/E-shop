const mongo = require("mongoose");

const subcategorySchemas = mongo.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: [2, "minlength is 2"],
      maxlength: [30, "maxlength is 30"],
      unique: [true, "must be unique"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongo.Schema.ObjectId,
      ref: "category",
      required: [true, "required field"],
    },
  },
  { timestamps: true }
);

const subCategory = mongo.model("subcategory", subcategorySchemas);
module.exports = subCategory;
