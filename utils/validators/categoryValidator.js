const slugify = require("slugify");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddlewares");
const CategoryModel = require("../../models/categoriesModel");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id format"),
  validatorMiddleware,
];
exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("field name is required")
    .isLength({ min: 3 })
    .withMessage("name min length is 3")
    .isLength({ max: 30 })
    .withMessage("name max length is 30")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id format"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid id format")
    .custom(async (val) => {
      console.log(` val >> ${val}`);
      await CategoryModel.findById(val).then((result) => {
        if (!result) return Promise.reject(new Error("not found"));
      });
    }),
  validatorMiddleware,
];
