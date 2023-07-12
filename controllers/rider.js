const Rider = require("../models/rider");
const ObjectId = require("mongoose").Types.ObjectId;
const cloudinary = require("../helper/imageUpload");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

exports.createrRider = async (req, res) => {
  const {
    fullname,
    email,
    password,
    phonenumber,
    latitude,
    longitude,
    avatar,
    credit,
  } = req.body;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "no.reply.picker@gmail.com",
      pass: "sypklqggmhsnhrwj",
    },
  });

  let mailOptions = {
    from: "no.reply.picker@gmail.com",
    to: `${email}`,
    subject: "Picker Registration!",
    text: "Congratulations you have successfully been registered as a picker! you can now login to the app and start your activities.",
    html: `<h1>Congratulations!</h1> <p>Congratulations you have successfully been registered as a picker! you can now login to the app and start your activities.</p>
    <img src="https://res.cloudinary.com/dswin85fm/image/upload/v1670779207/4702120_dnbhd7.jpg" width=300 height=300 style="horizontal-align:middle">
  `,
  };

  const isNewUser = await Rider.isThisEmailInUse(email);
  if (!isNewUser) {
    return res.json({
      success: false,
      message: "This email is already in use, try sign-in",
    });
  }
  const user = await Rider({
    fullname,
    email,
    password,
    phonenumber,
    latitude,
    longitude,
    avatar,
    credit,
  });
  await user.save();

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  res.json({ success: true, user });
};

exports.riderSignIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await Rider.findOne({ email });

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

exports.riderLocation = async (req, res) => {
  const { email } = req.body;
  const user = await Rider.findOne({ email });

  if (!user)
    return res.json({
      success: false,
      message: "rider was not found with this email",
    });

  res.json(user);
};

exports.uploadProfilePicture = async (req, res) => {
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

    const updatedUser = await Rider.findByIdAndUpdate(
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

exports.updatePassword = async (req, res) => {
  let { _id, password } = req.body;
  const filter = { _id: new ObjectId(_id) };
  const hash = await bcrypt.hash(password, 8);

  const update = { password: hash };
  const updatedPassword = await Rider.findOneAndUpdate(filter, update);

  res.json({ success: true, updatedPassword });
};

exports.updateRiderCredits = async (req, res) => {
  const { email, price } = req.body;
  const cred = await Rider.find({ email });

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

  const updatedUserCredit = await Rider.findOneAndUpdate(filter, update, {
    new: true,
  });

  let mailOptions = {
    from: "no.reply.picker@gmail.com",
    to: `${email}`,
    subject: "Wallet Credit",
    text: "Your wallet has been credited",
    html: `<h1>Credited!</h1> <p>Your wallet has been credited the Amount of Rs.${price} and your new credit is Rs.${newCredit} .</p>
      <img src="https://res.cloudinary.com/dswin85fm/image/upload/v1670779207/4702120_dnbhd7.jpg" width=300 height=300 style="horizontal-align:middle">
    `,
  };

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

exports.retriveRiderInfo = async (req, res) => {
  const { email } = req.body;
  const rider = await Rider.findOne({ email });
  if (!rider) {
    console.log(error);
  }
  res.json({ success: true, rider });
};

exports.updateRiderLocation = async (req, res) => {
  const { latitude, longitude, _id } = req.body;
  const filter = { _id: new ObjectId(_id) };
  const update = { latitude, longitude };
  console.log("the corrdinates are ", latitude, longitude);
  const updatedOrder = await Rider.findOneAndUpdate(filter, update, {
    new: true,
  });
  res.json({ success: true, updatedOrder });
};
