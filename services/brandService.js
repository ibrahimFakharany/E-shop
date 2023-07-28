const asyncHandler = require("express-async-handler");
const sharp = require("sharp");

const { v4: uuidv4 } = require("uuid");
const { uploadImage } = require("../middlewares/uploadImageMiddleware");
const BrandModel = require("../models/brandModel");

exports.uploadBrandImage = uploadImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `brands-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/brands/${fileName}`);

    req.body.image = fileName;
  }
  next();
});

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactory");
const brandModel = require("../models/brandModel");

// @desc   Create new brand
// @route  POST /api/v1/brands/
// @access Private
exports.createBrand = createOne(BrandModel);

// @desc   Get all brands
// @route  GET /api/v1/brands
// @access Private
exports.getAllBrands = getAll(brandModel);

// @desc   Get single brand
// @route  GET /api/v1/brands/:id
// @access Public
exports.getBrand = getOne(BrandModel);

// @desc   Update single brand
// @route  PUT /api/v1/brands/:id
// @access Private
exports.updateBrand = updateOne(BrandModel);

// @desc   Delete single brand
// @route  DELETE /api/v1/brands/:id
// @access Private
exports.deleteBrand = deleteOne(BrandModel);
