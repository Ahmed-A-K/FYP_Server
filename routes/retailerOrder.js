const express = require("express");
const { check } = require("express-validator");

const router = express.Router();
const {
  createrRetailerOrder,
  findRetailerOrder,
  showAllRetailerOrders,
  updateRetailerOrderEmail,
  updateOrderStatus,
} = require("../controllers/retailerOrder");
const { validateOrder } = require("../middleware/validation/retailerOrder");

router.post("/create-retailer-order", validateOrder, createrRetailerOrder);
router.post("/show-retailer-order", findRetailerOrder);
router.post("/update-retailer-order", updateRetailerOrderEmail);
router.post("/all-retailer-orders", showAllRetailerOrders);
router.post("/updateStatus-retailer-orders", updateOrderStatus);

module.exports = router;
