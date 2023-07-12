const { check, validationResult } = require("express-validator");

exports.validateRiderSignup = [
  check("fullname")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Name is required!")
    // .not()
    .isString()
    .withMessage("Must be a valid name!")
    .isLength({ min: 3, max: 20 })
    .withMessage("Name must be within 3 to 20 characters"),
  check("email").normalizeEmail().isEmail().withMessage("Invalid email"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is empty")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8 to 20 characters long"),
  check("phonenumber")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Phonenumber is empty")
    .isLength({ min: 11, max: 11 })
    .withMessage("Phonenumber must be 11 characters long"),
];

exports.riderValidation = (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();

  const error = result[0].msg;
  res.json({ success: false, message: error });
};

exports.validateRiderSignIn = [
  check("email").trim().isEmail().withMessage("email / password is required!"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("email / password is required!"),
];
