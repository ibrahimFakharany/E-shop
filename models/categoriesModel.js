const mongo = require("mongoose");

const categorySchema = mongo.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minlength: [3, "min length is 3"],
      maxlength: [30, "maxlength is 30"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);
const setImageURL = (doc) => {
  const newURL = `${process.env.BASE_URL}/categories/${doc.image}`;
  doc.image = newURL;
};

categorySchema.post("init", (doc) => {
  setImageURL(doc);
});

categorySchema.post("save", (doc) => {
  setImageURL(doc);
});
const CategoryModel = mongo.model("category", categorySchema);
module.exports = CategoryModel;
