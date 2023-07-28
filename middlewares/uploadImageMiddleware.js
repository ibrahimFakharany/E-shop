const multer = require("multer");
const AppError = require("../utils/appError");

const upload = () => {
  const multerStorage = multer.memoryStorage();
  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) cb(null, true);
    else cb(new AppError("only images allowed", 400), false);
  };
  return multer({ storage: multerStorage, fileFilter: multerFilter });
};
exports.uploadImage = (fieldName) => upload().single(fieldName);

exports.uploadMixOfImages = (arrayOfOptions) => upload().fields(arrayOfOptions);
