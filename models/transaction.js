const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema({
    sender: {
      type: String,
      required: true,
    },
    reciver: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    amountSent: {
      type: Number,
      required: true,
    },
  });

  module.exports = mongoose.model("Transaction", transactionSchema);