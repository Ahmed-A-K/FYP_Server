const Admin = require("../models/admin");
const Rider = require("../models/rider");
const ObjectId = require("mongoose").Types.ObjectId;
const cloudinary = require("../helper/imageUpload");
const nodemailer = require("nodemailer");

exports.createrRiderAdmin = async (req, res) => {
  const { fullname, email, password, phonenumber, latitude, longitude } =
    req.body;

  const isNewUser = await Rider.isThisEmailInUse(email);
  if (!isNewUser) {
    return res.json({
      success: false,
      message: "This email is already in use, try sign-in",
    });
  }
  const user = await Admin({
    fullname,
    email,
    password,
    phonenumber,
    latitude,
    longitude,
  });
  await user.save();
  res.json({ success: true, user });
};

exports.uploadCnic = async (req, res) => {
  const { _id } = req.body;
  if (!_id)
    return res
      .status(401)
      .json({ success: false, message: "unauthorized access!" });

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${_id}_profile`,
      width: 1200,
      height: 800,
      crop: "fill",
    });
    const filter = { _id: new ObjectId(_id) };

    const updatedUser = await Admin.findByIdAndUpdate(
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

exports.sendEmail = async (req, res) => {
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
    subject: "Rider Decline",
    text: "You have been declined as a rier",
    html: `<h1>NOTICE!</h1> <p>Your credentials could not be verified so you have been declined registration as a rider.</p>
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

exports.showVerfications = async (req, res) => {
  const result = await Admin.find({});

  if (!result)
    return res.json({
      success: false,
      message: "No available requests",
    });
  res.json(result);
};

exports.updateStatus = async (req, res) => {
  const { _id } = req.body;
  const filter = { _id: new ObjectId(_id) };
  const update = { status: true };
  const updatedStatus = await Admin.findOneAndUpdate(filter, update, {
    new: true,
  });
  res.json({ success: true, updatedStatus });
};
