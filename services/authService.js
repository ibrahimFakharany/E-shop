const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/userModel");

const ApiError = require("../utils/appError");
const { createToken, sendEmail } = require("../utils/utils");
const AppError = require("../utils/appError");

exports.signUp = expressAsyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  const token = createToken(user._id);

  res.status(200).json({ data: user, token: token });
});

exports.login = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new ApiError("email or password is not correct", 401));
  }

  const token = createToken(user._id);
  res.status(200).json({ data: user, token });
});

exports.protect = expressAsyncHandler(async (req, res, next) => {
  // getting the token from header

  if (
    !req.headers.authorization &&
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return next(new AppError("unAuthorized", 401));
  }

  // check if the token valid
  const { userId, iat } = jwt.verify(
    req.headers.authorization.split(" ")[1],
    process.env.TOKEN_SECRET
  );
  const user = await User.findById(userId);

  // and not expired
  if (user.passwordLastChanged) {
    const lastChanged = parseInt(user.passwordLastChanged.getTime() / 1000, 10);
    if (lastChanged > iat) {
      return next(
        new ApiError("The user has changed his password please login again")
      );
    }
  }

  req.user = user;
  next();
  // check if the user doesnt change the password
});
exports.allowedTo = (...roles) =>
  expressAsyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError("your are not allowed"));
    }
    next();
  });

exports.forgetPassword = expressAsyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError("user not found", 404));
  }
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.resetCode = hashedResetCode;
  user.expireDateCode = Date.now() + 10 * 60 * 1000;
  user.isResetCodeVerified = false;

  const message = `Hi ${user.name}\nwe recieved a request for reset your password\nplease enter this code for resetting password\n${resetCode}`;

  const options = {
    to: user.email,
    subject: "White shop",
    content: message,
  };

  try {
    await sendEmail(options);
    await user.save();
    res
      .status(200)
      .json({ status: true, message: "Reset code sent to your email" });
  } catch (e) {
    console.log(e);
    user.resetCode = undefined;
    user.expireDateCode = undefined;
    user.isResetCodeVerified = undefined;
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
});

exports.verifyCode = expressAsyncHandler(async (req, res, next) => {
  const { email, code } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ApiError("user not found", 404));
  }

  const hashedResetCode = crypto
    .createHash("sha256")
    .update(code)
    .digest("hex");

  if (hashedResetCode !== user.resetCode || user.expireDateCode < Date.now())
    return next(new ApiError("incorrect reset code or expired"));

  user.isResetCodeVerified = true;
  user.save();
  res.status(200).json({ status: true });
});

exports.resetPassword = expressAsyncHandler(async (req, res, next) => {
  const { email, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ApiError("user not found", 404));
  }
  if (!user.isResetCodeVerified) {
    return next(new ApiError("reset code is not verified", 400));
  }
  user.password = newPassword;
  user.isResetCodeVerified = undefined;
  await user.save();
  const token = createToken(user._id);
  res.status(200).json({ token });
});

exports.changeMyPassword = expressAsyncHandler(async (req, res, next) => {
  const { newPassword } = req.body;
  const user = await User.findById(req.user._id);

  user.password = newPassword;

  await user.save();

  const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: "30m",
  });

  res.status(200).json({
    token,
  });
});
