const Retailer = require("../models/retailer");
const nodemailer = require("nodemailer");
const ObjectId = require("mongoose").Types.ObjectId;
exports.createrRetailer = async (req, res) => {
  const { businessname, email, password, ntnnumber, address } = req.body;

  const isNewUser = await Retailer.isThisEmailInUse(email);
  if (!isNewUser) {
    return res.json({
      success: false,
      message: "This email is already in use, try sign-in",
    });
  }
  const retailer = await Retailer({
    businessname,
    email,
    password,
    ntnnumber,
    address,
    credit: 0,
  });
  await retailer.save();
  res.json({ success: true, retailer });
};

exports.retailerSignIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await Retailer.findOne({ email });

  if (!user)
    return res.json({
      success: false,
      message: "retailer not found with this email",
    });

  const isMatched = await user.comparePassword(password);

  if (!isMatched)
    return res.json({
      success: false,
      message: "either email for password does not match!",
    });

  res.json({ success: true, user });
};

exports.updateCredits = async (req, res) => {
  const { email, price } = req.body;
  const cred = await Retailer.find({ email });

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

  const updatedUserCredit = await Retailer.findOneAndUpdate(filter, update, {
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

exports.subtractCredits = async (req, res) => {
  const { email, price } = req.body;
  const cred = await Retailer.find({ email });
  const credit = cred[0].credit;
  const newCredit = credit - parseInt(price);
  const update = { credit: newCredit };
  const filter = { email };

  const updatedUserCredit = await Retailer.findOneAndUpdate(filter, update, {
    new: true,
  });
  res.json({ success: true });
};

exports.updatePassword = async (req, res) => {
  let { _id, password } = req.body;
  const filter = { _id: new ObjectId(_id) };
  const hash = await bcrypt.hash(password, 8);

  const update = { password: hash };
  const updatedPassword = await Rider.findOneAndUpdate(filter, update);

  res.json({ success: true, updatedPassword });
};
