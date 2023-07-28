const express = require("express");

const router = express.Router();

const { createUserValidator } = require("../utils/validators/userValidator");
const {
  signUp,
  login,
  forgetPassword,
  verifyCode,
  resetPassword,
  changeMyPassword,
  protect,
} = require("../services/authService");
const { uploadUserImage, resizeImage } = require("../services/userService");

router.post(
  "/signup",
  uploadUserImage,
  resizeImage,
  createUserValidator,
  signUp
);
router.post("/login", login);
router.post("/forgetPassword", forgetPassword);
router.post("/verifyCode", verifyCode);
router.put("/resetPassword", resetPassword);
router.post("/changeMyPassword", protect, changeMyPassword);

module.exports = router;
