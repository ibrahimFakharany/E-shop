const express = require("express");

const {
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
  createCategoryValidator,
} = require("../utils/validators/categoryValidator");
const {
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  createCategories,
  uploadCategoryImage,
  resizeImage,
} = require("../services/categoriesService");

const subcategoryRouter = require("./subCategoryRouter");
const { protect } = require("../services/authService");

const router = express.Router();
router.use("/:categoryId/subcategories", subcategoryRouter);

router
  .route("/")
  .get(getCategories)
  .post(
    protect,
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategories
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .delete(deleteCategoryValidator, deleteCategory)
  .put(
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  );

module.exports = router;
