const sharp = require("sharp");

const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

const ProductModel = require("../models/productModel");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");

exports.uploadProductImages = uploadMixOfImages([
  { name: "coverImage", maxCount: 1 },
  { name: "images", maxCount: 8 },
]);

exports.resizeProductsImages = asyncHandler(async (req, res, next) => {
  const { coverImage, images } = req.files;
  const coverImageFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
  if (coverImage) {
    await sharp(coverImage[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${coverImageFileName}`);
    req.body.coverImage = coverImageFileName;
  }

  if (images) {
    req.body.images = [];
    await Promise.all(
      images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index}.jpeg`;
        await sharp(img.buffer)
          .resize(600, 600)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);
        req.body.images.push(imageName);
      })
    );
    req.body.images.reverse();
  }
  next();
});
const {
  deleteOne,
  updateOne,
  getOne,
  createOne,
  getAll,
} = require("./handlerFactory");

// @desc   Create new Product
// @route  POST /api/v1/products/
// @access Private
exports.createProduct = createOne(ProductModel);

// @desc   Get all products
// @route  GET /api/v1/products
// @access Private
exports.getAllProducts = getAll(ProductModel);

// @desc   Get product
// @route  GET /api/v1/products/:id
// @access Private
exports.getProduct = getOne(ProductModel, "reviews");

// @desc   Update product
// @route  PUT /api/v1/products/:id
// @access Private
exports.updateProduct = updateOne(ProductModel);

// @desc   Delete product
// @route  DELETE /api/v1/products/:id
// @access Private
exports.deleteProduct = deleteOne(ProductModel);
