const mongo = require("mongoose");

const brandSchema = mongo.Schema(
  {
    name: {
      type: String,
      unique: [true, "brand name must be unique"],
      minlength: [3, "brand name min length is 3"],
      maxlength: [30, "brand name max length is 30"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: { type: String },
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  const newURL = `${process.env.BASE_URL}/brands/${doc.image}`;
  doc.image = newURL;
};

brandSchema.post("init", (doc) => {
  setImageURL(doc);
});

brandSchema.post("save", (doc) => {
  setImageURL(doc);
});

const brandModel = mongo.model("brand", brandSchema);
module.exports = brandModel;
