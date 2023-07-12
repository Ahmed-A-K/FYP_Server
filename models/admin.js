const mongoose = require("mongoose");
const Rider = require("../models/rider");
const AdminRiderSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  status: Boolean,
  avatar: String,
});

AdminRiderSchema.methods.comparePassword = async function (password) {
  if (!password) throw new Error("Password is missing, cannot compare!");

  try {
    const result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    console.log("Error while comparing password!", error.message);
  }
};

AdminRiderSchema.statics.isThisEmailInUse = async function (email) {
  if (!email) throw new Error("Invalid Email");
  try {
    const user = await this.findOne({ email });
    if (user) {
      return false;
    }
    return true;
  } catch (error) {
    console.log("error inside isThisEmailInUse Method", error.message);
    return false;
  }
};

module.exports = mongoose.model("Admin", AdminRiderSchema);
