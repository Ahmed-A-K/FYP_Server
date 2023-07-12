const mongoose = require("mongoose");

const retailerOrderSchema = new mongoose.Schema({
  productAmount: {
    type: Number,
    required: true,
  },
  biddingAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  itemAmount: {
    type: Number,
    required: true,
  },
  extraInfo: {
    type: String,
    required: false,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  riderEmail: {
    type: String,
    // required: true,
  },
  itemdescription: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("RetailerOrder", retailerOrderSchema);
