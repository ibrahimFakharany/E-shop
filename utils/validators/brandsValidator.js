const slugify = require("slugify");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddlewares");
const brandModel = require("../../models/brandModel");

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("name must be not empty")
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
exports.getBrandValidator = [
  check("id").isMongoId().withMessage("must be a valid id"),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("must be valid id"),
  check("name")
    .notEmpty()
    .withMessage("name must be not empty")
    .isLength({ min: 3 })
    .withMessage("name min length is 3")
    .isLength({ max: 30 })
    .withMessage("name max length is 30"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];
exports.deleteBrandValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid id format")
    .custom(async (val) => {
      console.log(` val >> ${val}`);
      await brandModel.findById(val).then((result) => {
        if (!result) return Promise.reject(new Error("not found"));
      });
    }),
  validatorMiddleware,
];