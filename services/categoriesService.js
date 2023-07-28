const asyncHandler = require("express-async-handler");
const sharp = require("sharp");

const { v4: uuidv4 } = require("uuid");
const { uploadImage } = require("../middlewares/uploadImageMiddleware");
const Category = require("../models/categoriesModel");
const CategoryModel = require("../models/categoriesModel");

// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/categories");
//   },
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split("/")[1];
//     console.log(file);
//     const fileName = `categories-${uuidv4()}-${Date.now()}.${ext}`;
//     cb(null, fileName);
//   },
// });

exports.uploadCategoryImage = uploadImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const fileName = `categories-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${fileName}`);

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

// @desc   Get categories
// @route  GET /api/v1/categories
// @access Private
exports.getCategories = getAll(Category);
// @desc   Get category
// @route  GET /api/v1/categories/:id
// @access Public
exports.getCategory = getOne(Category);
// @desc   Create Category
// @route  POST /api/v1/categories
// @access Private
exports.createCategories = createOne(Category);

// @desc   Update Category
// @route  PUT /api/v1/categories/:id
// @access Private
exports.updateCategory = updateOne(CategoryModel);
// @desc   Delete Category
// @route  DELETE /api/v1/categories/:id
// @access Private
exports.deleteCategory = deleteOne(CategoryModel);
