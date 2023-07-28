const slugify = require("slugify");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddlewares");

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("name field is required")
    .isLength({ min: 2 })
    .withMessage("min length is 2")
    .isLength({ max: 30 })
    .withMessage("max length is 30")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("category id is required")
    .isMongoId()
    .withMessage("category id must be a valid category id"),
  validatorMiddleware,
];

exports.getSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("sub category id field is required")
    .isMongoId()
    .withMessage("sub category id field must be valid"),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("name").notEmpty().withMessage("sub category name must be valid"),
  check("id").isMongoId().withMessage("id must be a valid id"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];
exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid id format"),
  validatorMiddleware,
];
