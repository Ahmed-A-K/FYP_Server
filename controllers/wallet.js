const Wallet = require("../models/wallet");
const cloudinary = require("../helper/imageUpload");
const ObjectId = require("mongoose").Types.ObjectId;
const nodemailer = require("nodemailer");

exports.createReciept = async (req, res) => {
  const { email, price } = req.body;
  const receipt = await Wallet({
    email,
    price,
  });
  await receipt.save();
  res.json({ success: true, receipt });
};

exports.uploadReciept = async (req, res) => {
  const { _id } = req.body;
  if (!_id)
    return res
      .status(401)
      .json({ success: false, message: "unauthorized access!" });

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${_id}_reciept`,
      width: 1010,
      height: 1699,
      crop: "fill",
    });
    const filter = { _id: new ObjectId(_id) };

    const updatedUser = await Wallet.findByIdAndUpdate(
      filter,
      { receipt: result.url },
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

exports.showReciept = async (req, res) => {
  const result = await Wallet.find({});

  if (!result)
    return res.json({
      success: false,
      message: "No available requests",
    });
  res.json(result);
};

exports.sendDeclineEmail = async (req, res) => {
  const { email } = req.body;
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
    subject: "Credit Approval Decline",
    text: "You have been declined credit approval",
    html: `<h1>NOTICE!</h1> <p>Your credentials could not be verified so you have been declined credit approval.</p>
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
};

exports.updateStatusBill = async (req, res) => {
  const { _id } = req.body;
  const filter = { _id: new ObjectId(_id) };
  const update = { status: true };
  const updatedStatus = await Wallet.findOneAndUpdate(filter, update, {
    new: true,
  });
  res.json({ success: true });
};
