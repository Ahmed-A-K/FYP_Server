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
  createReciept,
  uploadReciept,
  showReciept,
  sendDeclineEmail,
  updateStatusBill,
} = require("../controllers/wallet");

router.post("/create-reciept", createReciept);
router.post("/add-receipt", uploads.single("reciept"), uploadReciept);
router.post("/show-reciept", showReciept);
router.post("/decline-reciept", sendDeclineEmail);
router.post("/update-reciept", updateStatusBill);
module.exports = router;
