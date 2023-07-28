const asyncHandler = require("express-async-handler");
const sharp = require("sharp");

const { v4: uuidv4 } = require("uuid");
const { uploadImage } = require("../middlewares/uploadImageMiddleware");
const User = require("../models/userModel");

exports.uploadUserImage = uploadImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `users-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${fileName}`);
    req.body.image = fileName;
  }
  next();
});

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactory");

// @desc   Create new user
// @route  POST /api/v1/brands/
// @access Private
exports.createUser = createOne(User);

// @desc   Get all users
// @route  GET /api/v1/users
// @access Private
exports.getAllUsers = getAll(User);

// @desc   Get single user
// @route  GET /api/v1/users/:id
// @access Public
exports.getSingleUser = getOne(User);

// @desc   Update single user
// @route  PUT /api/v1/users/:id
// @access Private
exports.updateUser = updateOne(User);

// @desc   Delete single user
// @route  DELETE /api/v1/users/:id
// @access Private
exports.deleteUser = deleteOne(User);
