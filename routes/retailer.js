const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const {
  createrRetailer,
  retailerSignIn,
  updateCredits,
  subtractCredits,
  updatePassword,
} = require("../controllers/retailer");
const {
  reatilerValidation,
  validateRetailerSignIn,
  validateRetailerSignup,
} = require("../middleware/validation/retailer");

router.post(
  "/create-retailer",
  validateRetailerSignup,
  reatilerValidation,
  createrRetailer
);
router.post(
  "/retailer-signin",
  validateRetailerSignIn,
  reatilerValidation,
  retailerSignIn
);

router.post("/update-RetailerCredit", updateCredits);
router.post("/subtract-RetailerCredit", subtractCredits);
router.post("/update-retailerPassword", updatePassword);

module.exports = router;
