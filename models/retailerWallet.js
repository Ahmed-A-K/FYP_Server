const mongoose = require("mongoose");

const retailerRecieptSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  receipt: String,
  status: Boolean,
});

module.exports = mongoose.model("retailerReceipt", retailerRecieptSchema);
