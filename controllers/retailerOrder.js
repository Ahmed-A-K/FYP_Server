const RetailerOrder = require("../models/retailerOrder");
const ObjectId = require("mongoose").Types.ObjectId;
const nodemailer = require("nodemailer");
exports.createrRetailerOrder = async (req, res) => {
  const {
    productAmount,
    biddingAmount,
    status,
    itemAmount,
    extraInfo,
    latitude,
    longitude,
    userEmail,
    riderEmail,
    itemdescription,
    address,
  } = req.body;

  const order = await RetailerOrder({
    productAmount,
    biddingAmount,
    status,
    itemAmount,
    extraInfo,
    latitude,
    longitude,
    userEmail,
    riderEmail,
    itemdescription,
    address,
  });
  await order.save();
  res.json({ success: true, order });
};

exports.updateRetailerOrderEmail = async (req, res) => {
  const { _id, riderEmail, email } = req.body;
  const update = { riderEmail: riderEmail };
  const filter = { _id: new ObjectId(_id) };
  const updatedOrder = await RetailerOrder.findOneAndUpdate(filter, update, {
    new: true,
  });

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
    subject: "Bid accepted!",
    text: "Your bid has been accepted.",
    html: `<h1>NOTICE!</h1> <p>Your bid has been accepted. You can check your picker info in your order history.</p><img src="https://res.cloudinary.com/dswin85fm/image/upload/v1670779207/4702120_dnbhd7.jpg" width=300 height=300 style="horizontal-align:middle">
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
  res.json({ success: true, updatedOrder });
};

exports.showAllRetailerOrders = async (req, res) => {
  const order = await RetailerOrder.find({});
  if (!order)
    return res.json({
      success: false,
      message: "No order",
    });
  res.json(order);
};

exports.findRetailerOrder = async (req, res) => {
  const { userEmail } = req.body;
  const order = await RetailerOrder.find({ userEmail });

  if (!order)
    return res.json({
      success: false,
      message: "No matching order",
    });

  res.json(order);
};

exports.updateOrderStatus = async (req, res) => {
  const { _id, userEmail } = req.body;
  const update = { status: true };
  const filter = { _id: new ObjectId(_id) };

  const updatedOrder = await RetailerOrder.findOneAndUpdate(filter, update, {
    new: true,
  });

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "no.reply.picker@gmail.com",
      pass: "sypklqggmhsnhrwj",
    },
  });

  let mailOptions = {
    from: "no.reply.picker@gmail.com",
    to: `${userEmail}`,
    subject: "Delivered!",
    text: "Your package has been delivered.",
    html: `<h1>NOTICE!</h1> <p>Your package has been delivered. Thankyou for using Pickers.</p><img src="https://res.cloudinary.com/dswin85fm/image/upload/v1670779207/4702120_dnbhd7.jpg" width=300 height=300 style="horizontal-align:middle">
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

  res.json({ success: true, updatedOrder });
};
