const fs = require("fs");

const dotenv = require("dotenv");

const Product = require("./models/productModel");

const databaseConnection = require("./config/databaseConfig");

dotenv.config({ path: "config.env" });

databaseConnection();

const products = JSON.parse(fs.readFileSync("./products.json"));

const insertData = async () => {
  try {
    await Product.insertMany(products);
    console.log("INSERTED");
    process.exit();
  } catch (e) {
    console.log(e);
    process.exit();
  }
};

const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log("DELETED");
    process.exit();
  } catch (e) {
    console.log(e);
    process.exit();
  }
};

if (process.argv[2]=== "i") {
  insertData();
} else if (process.argv[2] === "d") {
  deleteData();
}
