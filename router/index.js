const categoriesRoute = require("./categoryRouter");
const subCategoriesRoute = require("./subCategoryRouter");
const brandsRoute = require("./brandsRouter");
const productsRoute = require("./productRouter");
const userRoute = require("./userRouter");
const authRoute = require("./authRouter");
const reviewRoute = require("./reviewRouter");
const wishlistRoute = require("./wishlistRoute");
const addressRoute = require("./addressRoute");
const couponRoute = require("./couponRouter");
const cartRoute = require("./cartRouter");
const orderRoute = require("./orderRoute");

const mountRoutes = (app) => {
  app.use("/api/v1/categories", categoriesRoute);
  app.use("/api/v1/subcategories", subCategoriesRoute);
  app.use("/api/v1/brands/", brandsRoute);
  app.use("/api/v1/products/", productsRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/reviews", reviewRoute);
  app.use("/api/v1/wishlist", wishlistRoute);
  app.use("/api/v1/address", addressRoute);
  app.use("/api/v1/coupons", couponRoute);
  app.use("/api/v1/cart", cartRoute);
  app.use("/api/v1/order", orderRoute);
};
module.exports = mountRoutes;
