const slugify = require("slugify");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddlewares");
const Category = require("../../models/categoriesModel");
const SubCategory = require("../../models/subCategoryModel");
const ProductModel = require("../../models/productModel");

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("this field is required")
    .isLength({ min: 3 })
    .withMessage("min length is 3")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("this field is required")
    .isLength({ max: 2000 })
    .withMessage("too long description"),
  check("price")
    .notEmpty()
    .withMessage("field is required")
    .isNumeric()
    .withMessage("must be number"),
  check("sold").optional().isNumeric().withMessage("sold value must be number"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("price after discount must be number")
    .custom((val, { req }) => {
      if (val >= req.body.price) {
        throw Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),
  check("coverImage").notEmpty().withMessage("this field is required"),
  check("images").isArray().withMessage("must be array"),
  check("colors").optional().isArray().withMessage("must be array"),
  check("category")
    .notEmpty()
    .withMessage("field is required")
    .isMongoId()
    .withMessage("invalid id")
    .custom((val, { req }) =>
      Category.findById(val).then((result) => {
        if (!result) {
          return Promise.reject(new Error("category not found"));
        }
        return true;
      })
    ),
  check("subCategories")
    .optional()
    .isMongoId()
    .withMessage("invalid id")
    .isArray()
    .withMessage("must be array")
    // validate that subcategories exists
    .custom((subcategories) =>
      SubCategory.find({ _id: { $exists: true, $in: subcategories } }).then(
        (savedSubCategories) => {
          if (
            savedSubCategories.length < 1 ||
            savedSubCategories.length !== subcategories.length
          )
            return Promise.reject(
              new Error("one of the categories you entered does not exist")
            );
        }
      )
    )
    .custom((val, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subCategories) => {
          const ids = [];
          subCategories.forEach((e) => ids.push(e._id.toString()));
          const checker = (target, arr) => target.every((v) => arr.includes(v));
          if (!checker(val, ids)) {
            return Promise.reject(
              new Error(
                "One of subcategories you entered does not belong to the category you entered"
              )
            );
          }
        }
      )
    ),
  check("brand").isMongoId().withMessage("invalid id"),
  check("ratingAvg")
    .optional()
    .isNumeric()
    .withMessage("must be number")
    .isLength({ min: 1 })
    .withMessage("min avg rating is 1.0")
    .isLength({ max: 5.0 })
    .withMessage("max avg rating is 5.0"),
  check("ratingQuantity").optional().isNumeric().withMessage("must be number"),
  validatorMiddleware,
];
exports.updateValidator = [
  body("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
exports.deleteProductValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid id format")
    .custom((val) => {
      ProductModel.findById(val).then((result) => {
        if (!result) {
          return Promise.reject(new Error("Not found"));
        }
      });
    }),

  validatorMiddleware,
];
