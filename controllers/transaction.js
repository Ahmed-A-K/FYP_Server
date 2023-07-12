const Transaction = require("../models/transaction");

exports.createTransaction = async (req, res) => {
  const { sender, reciver, date, amountSent } = req.body;

  const transaction = await Transaction({
    sender,
    reciver,
    date,
    amountSent,
  });
  await transaction.save();

  res.json({ success: true, transaction });
};
