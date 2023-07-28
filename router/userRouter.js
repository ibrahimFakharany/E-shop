const express = require("express");

const router = express.Router();

const {
  createUser,
  getAllUsers,
  updateUser,
  getSingleUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
} = require("../services/userService");
const { createUserValidator } = require("../utils/validators/userValidator");

router
  .route("/")
  .post(uploadUserImage, resizeImage, createUserValidator, createUser)
  .get(getAllUsers);
router.route("/:id").get(getSingleUser).put(updateUser).delete(deleteUser);

module.exports = router;
