const express = require("express");
const router = express.Router();

const { createTransaction } = require("../controllers/transaction");
router.post("/create-transaction", createTransaction);

module.exports = router;
