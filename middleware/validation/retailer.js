const { check, validationResult } = require("express-validator");

exports.validateRetailerSignup = [
  check("businessname")
    .trim()
    .not()
    .isEmpty()
    .withMessage("business name is required!")
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
  check("confirmPassword")
    .trim()
    .not()
    .isEmpty()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Both password are not the same");
      }
      return true;
    }),
  check("ntnnumber")
    .trim()
    .not()
    .isEmpty()
    .withMessage("ntnnumber is empty")
    .isLength({ min: 7, max: 7 })
    .withMessage("ntnnumber must be 7 characters long"),
  check("address").trim().not().isEmpty().withMessage("address is empty"),
];

exports.reatilerValidation = (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();

  const error = result[0].msg;
  res.json({ success: false, message: error });
};

exports.validateRetailerSignIn = [
  check("email").trim().isEmail().withMessage("email / password is required!"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("email / password is required!"),
];
