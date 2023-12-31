const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const retailerSchema = new mongoose.Schema({
  businessname: {
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
  ntnnumber: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  credit: {
    type: Number,
    required: true,
  },
});

retailerSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, 8, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      next();
    });
  }
});

retailerSchema.methods.comparePassword = async function (password) {
  if (!password) throw new Error("Password is missing, cannot compare!");

  try {
    const result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    console.log("Error while comparing password!", error.message);
  }
};

retailerSchema.statics.isThisEmailInUse = async function (email) {
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

module.exports = mongoose.model("Retailer", retailerSchema);
