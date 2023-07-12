const User = require("../models/user");
const ObjectId = require("mongoose").Types.ObjectId;
const cloudinary = require("../helper/imageUpload");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  const { fullname, email, password, cred } = req.body;
  const credit = parseInt(cred);

  const isNewUser = await User.isThisEmailInUse(email);
  if (!isNewUser) {
    return res.json({
      success: false,
      message: "This email is already in use, try signing-in",
    });
  }
  const user = await User({
    fullname,
    email,
    password,
    credit,
  });
  await user.save();
  // res.json(user);
  res.json({ success: true, user });
};

exports.userSignIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user)
    return res.json({
      success: false,
      message: "user not found with this email",
    });

  const isMatched = await user.comparePassword(password);

  if (!isMatched)
    return res.json({
      success: false,
      message: "either email for password does not match!",
    });

  res.json({ success: true, user });
};

exports.uploadProfile = async (req, res) => {
  const { _id } = req.body;
  if (!_id)
    return res
      .status(401)
      .json({ success: false, message: "unauthorized access!" });

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${_id}_profile`,
      width: 500,
      height: 500,
      crop: "fill",
    });
    const filter = { _id: new ObjectId(_id) };

    const updatedUser = await User.findByIdAndUpdate(
      filter,
      { avatar: result.url },
      { new: true }
    );
    res
      .status(201)
      .json({ success: true, message: "Your profile has updated!" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "server error, try after some time" });
    console.log("Error while uploading profile image", error.message);
  }
};

exports.updateCredits = async (req, res) => {
  const { email, price } = req.body;
  const cred = await User.find({ email });

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "no.reply.picker@gmail.com",
      pass: "sypklqggmhsnhrwj",
    },
  });

  const credit = cred[0].credit;
  const newCredit = credit + parseInt(price);
  const update = { credit: newCredit };
  const filter = { email };

  let mailOptions = {
    from: "no.reply.picker@gmail.com",
    to: `${email}`,
    subject: "Wallet Credit",
    text: "Your wallet has been credited",
    html: `<h1>Credited!</h1> <p>Your wallet has been credited the Amount of Rs.${price} and your new credit is Rs.${newCredit} .</p>
      <img src="https://res.cloudinary.com/dswin85fm/image/upload/v1670779207/4702120_dnbhd7.jpg" width=300 height=300 style="horizontal-align:middle">
    `,
  };

  const updatedUserCredit = await User.findOneAndUpdate(filter, update, {
    new: true,
  });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      res.json({ success: true });
    }
  });

  res.json({ success: true, updatedUserCredit });
};

///send mail need to complete
exports.subtractCredits = async (req, res) => {
  const { email, price } = req.body;
  const cred = await User.find({ email });
  const credit = cred[0].credit;
  const newCredit = credit - parseInt(price);
  const update = { credit: newCredit };
  const filter = { email };

  const updatedUserCredit = await User.findOneAndUpdate(filter, update, {
    new: true,
  });
  res.json({ success: true });
};

exports.updateProfilePicture = async (req, res) => {
  const { _id } = req.body;
  if (!_id)
    return res
      .status(401)
      .json({ success: false, message: "unauthorized access!" });

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${_id}_profile`,
      width: 500,
      height: 500,
      crop: "fill",
    });
    const filter = { _id: new ObjectId(_id) };

    const updatedUser = await User.findByIdAndUpdate(
      filter,
      { avatar: result.url },
      { new: true }
    );
    res.status(201).json({ success: true, updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "server error, try after some time" });
    console.log("Error while uploading profile image", error.message);
  }
};

exports.updateUserPassword = async (req, res) => {
  let { _id, password } = req.body;
  const filter = { _id: new ObjectId(_id) };
  const hash = await bcrypt.hash(password, 8);

  const update = { password: hash };
  const updatedPassword = await User.findOneAndUpdate(filter, update);

  res.json({ success: true, updatedPassword });
};
