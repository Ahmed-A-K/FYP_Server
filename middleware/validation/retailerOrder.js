const { check } = require("express-validator");

exports.validateOrder = [
  check("productAmount")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Product amount is required"),
  check("biddingAmount")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Bidding amount is required"),
  check("itemAmount")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Number of items is required"),
  check("itemdescription")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Item description is required"),
  check("address").trim().not().isEmpty().withMessage("Address is required"),
];
