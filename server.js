const path = require("path");

const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const compression = require("compression");

const app = express();
const AppError = require("./utils/appError");
const globalErrorMiddleware = require("./middlewares/errorMiddleware");
const databaseConnection = require("./config/databaseConfig");

app.use(cors());
app.options("*", cors());
app.use(compression());

dotenv.config({ path: "config.env" });
databaseConnection();
const mountRoutes = require("./router");

// env
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
const { PORT } = process.env;

// port
const server = app.listen(PORT, (err) => {
  if (err) console.log(`${err}`);
  else console.log("heloo from expres");
});

//requests
app.use(express.json());
app.use(express.static(path.join(__dirname, "/uploads")));

mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new AppError(`can't find route ${req.originalUrl}`, 400));
});

// handle rejections inside express
app.use(globalErrorMiddleware);
// handle rejections outside express
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejectionError ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("shutting down...");
    process.exit(1);
  });
});
