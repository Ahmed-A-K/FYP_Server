const express = require("express");
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
} = require("../controllers/retailerWallet");

router.post("/create-retailerReciept", createReciept);
router.post("/add-retailerReceipt", uploads.single("reciept"), uploadReciept);
router.post("/show-retailerReciept", showReciept);
router.post("/decline-retailerReciept", sendDeclineEmail);
router.post("/update-retailerReciept", updateStatusBill);
module.exports = router;
