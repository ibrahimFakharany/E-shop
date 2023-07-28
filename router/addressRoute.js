const express = require("express");

const router = express.Router();

const {
  addAddress,
  removeAddress,
  getAllAddresses,
} = require("../services/addressesService");
const { protect } = require("../services/authService");

router.use(protect);
router.route("/").post(addAddress).get(getAllAddresses);
router.route("/:addressId").delete(removeAddress);

module.exports = router;
