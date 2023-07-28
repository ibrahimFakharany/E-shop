const AppError = require("../utils/appError");

const sendErrorDev = (err, res) =>
  res.status(err.statusCode || 500).json({
    statusCode: err.statusCode || 500,
    status: err.status || "error",
    error: err,
    message: err.message,
    stack: err.stack,
  });

const sendErrorProd = (err, res) =>
  res.status(err.statusCode || 500).json({
    statusCode: err.statusCode || 500,
    message: err.message,
  });
const handleInvalidToken = () =>
  new AppError("Invalid token please login again", 401);

const handleExpireWebToken = () =>
  new AppError("Token expired please login again", 401);

  
const globalErrorMiddleware = (err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") err = handleInvalidToken();
    if (err.name === "TokenExpiredError") err = handleExpireWebToken();
    sendErrorProd(err, res);
  }
};
module.exports = globalErrorMiddleware;
