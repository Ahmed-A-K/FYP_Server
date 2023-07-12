const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const {
  createrOrder,
  findUserOrder,
  updateOrderEmail,
  showOrders,
  updateOrderStatus,
  cancelRider,
} = require("../controllers/order");
const { validateOrder } = require("../middleware/validation/order");

router.post("/create-order", validateOrder, createrOrder);
router.post("/show-order", findUserOrder);
router.post("/update-order", updateOrderEmail);
router.post("/all-orders", showOrders);
router.post("/status-orders", updateOrderStatus);
router.post("/cancel-orders", cancelRider);

module.exports = router;
