const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("invalid image file!", false);
  }
};
const uploads = multer({ storage, fileFilter });

const {
  createrRiderAdmin,
  uploadCnic,
  showVerfications,
  sendEmail,
  updateStatus,
} = require("../controllers/admin");

router.post("/admin-rider", createrRiderAdmin);
router.post("/admin-cnic", uploads.single("profile"), uploadCnic);
router.post("/show-all", showVerfications);
router.post("/send-email", sendEmail);
router.post("/update-status", updateStatus);
module.exports = router;
