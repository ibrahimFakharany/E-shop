const SubCategory = require("../models/subCategoryModel");

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactory");

exports.addCategoryIdToBodyMiddlware = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// @desc   add Fitler options to request
exports.addFilterOptionsMiddleware = (req, res, next) => {
  if (req.params.categoryId) {
    req.filterOptions = { category: req.params.categoryId };
  } else {
    req.filterOptions = {};
  }
  next();
};

// @desc   create sub category for specific category
// @desc   Create subCategory
// @route  POST /api/v1/subcategories
// @access Private
exports.createSubCategory = createOne(SubCategory);

// @desc   Get subcategories for specific category
// @desc   Get all subcategories if parent category not specified
// @route  GET /api/v1/subcategories
// @access Private
exports.getSubCategories = getAll(SubCategory);

// @desc   Get subCategory
// @route  GET /api/v1/subcategories/:id
// @access Public
exports.getSubCategory = getOne(SubCategory);

// @desc   Update subcategory name and parent category id
// @route  PUT /api/v1/subcategories/:id
// @access private
exports.updateSubCategory = updateOne(SubCategory);

// @desc   Delete subcategory
// @route  DELETE /api/v1/subcategories/:id
// @access Private
exports.deleteSubCategory = deleteOne(SubCategory);
