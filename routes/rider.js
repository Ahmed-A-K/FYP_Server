const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const multer = require("multer");

const {
  createrRider,
  riderSignIn,
  riderLocation,
  uploadProfilePicture,
  updatePassword,
  updateRiderCredits,
  retriveRiderInfo,
  updateRiderLocation,
} = require("../controllers/rider");
const {
  riderValidation,
  validateRiderSignIn,
  validateRiderSignup,
} = require("../middleware/validation/rider");

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("invalid image file!", false);
  }
};
const uploads = multer({ storage, fileFilter });

router.post(
  "/create-rider",
  validateRiderSignup,
  riderValidation,
  createrRider
);
router.post(
  "/rider-sign-in",
  validateRiderSignIn,
  riderValidation,
  riderSignIn
);
router.post("/find-rider", riderLocation);
router.post("/rider-upload", uploads.single("profile"), uploadProfilePicture);
router.post("/rider-password", updatePassword);
router.post("/rider-credit", updateRiderCredits);
router.post("/rider-info", retriveRiderInfo);
router.post("/rider-updateLocation", updateRiderLocation);

module.exports = router;
