const express = require("express");

const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductsImages,
} = require("../services/productServices");

const {
  createProductValidator,
  updateValidator,
} = require("../utils/validators/productValidator");

router
  .route("/")
  .post(
    uploadProductImages,
    resizeProductsImages,
    createProductValidator,
    createProduct
  )
  .get(getAllProducts);
router
  .route("/:id")
  .get(getProduct)
  .put(updateValidator, updateProduct)
  .delete(deleteProduct);

module.exports = router;
