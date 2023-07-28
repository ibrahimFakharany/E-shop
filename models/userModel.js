const mongo = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongo.Schema(
  {
    name: {
      type: String,
    },
    slug: {
      type: String,
      lowercase: true,
    },

    email: {
      type: String,
      require: [true, "Email is required"],
      unique: [true, "Email is already in use"],
    },
    role: { type: String, enum: ["manager", "admin", "user"], default: "user" },
    image: { type: String },
    phonenumber: {
      type: String,
      unique: [true, "Phone number is already in use"],
    },
    password: {
      type: String,
      minlength: [3, "too short password"],
      require: [true, "Password is required"],
    },
    passwordLastChanged: Date,
    resetCode: String,
    expireDateCode: Date,
    isResetCodeVerified: Boolean,
    wishlist: [
      {
        type: mongo.Schema.ObjectId,
        ref: "product",
      },
    ],
    address: [
      {
        id: { type: mongo.Schema.Types.ObjectId },
        alias: String,
        city: String,
        phone: String,
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hashSync(this.password, 10);
  this.passwordLastChanged = Date.now();
  next();
});
const UserModel = mongo.model("users", userSchema);
module.exports = UserModel;
