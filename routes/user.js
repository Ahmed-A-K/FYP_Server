const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const multer = require("multer");

const {
  createUser,
  userSignIn,
  uploadProfile,
  updateCredits,
  subtractCredits,
  updateUserPassword,
  updateProfilePicture,
} = require("../controllers/user");
const {
  validateUserSignup,
  userValidation,
  validateUserSignIn,
} = require("../middleware/validation/user");

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("invalid image file!", false);
  }
};
const uploads = multer({ storage, fileFilter });

router.post("/create-user", validateUserSignup, userValidation, createUser);
router.post("/sign-in", validateUserSignIn, userValidation, userSignIn);
router.post("/upload-profile", uploads.single("profile"), uploadProfile);
router.post("/update-credit", updateCredits);
router.post("/subtract-credit", subtractCredits);
router.post("/updateUser-Password", updateUserPassword);
router.post(
  "/updateUser-picture",
  uploads.single("profile"),
  updateProfilePicture
);
module.exports = router;
