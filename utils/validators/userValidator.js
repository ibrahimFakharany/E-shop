const slugify = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddlewares");
const userModel = require("../../models/userModel");

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 2 })
    .withMessage("Too short name min is 2 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Email not valid")
    .custom(async (email) => {
      if (await userModel.findOne({ email })) {
        throw new Error("Email is already in use");
      }
      return true;
    }),
  check("phonenumber")
    .notEmpty()
    .withMessage("phone number is required")
    .isMobilePhone("ar-EG")
    .withMessage("Please enter a valid Egyptian numbers")
    .custom(async (phonenumber) => {
      if (await userModel.findOne({ phonenumber })) {
        throw new Error("phone number is already in use");
      }
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("Too short password min is 6 characters")
    .custom((pwd, { req }) => {
      req.body.passwordLastChanged = Date.now();
      return true;
    }),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirmPassword is required")
    .custom((cPwd, { req }) => {
      if (cPwd !== req.body.password) {
        throw new Error("confirm password does not match password");
      }
      return true;
    }),

  validatorMiddleware,
];
