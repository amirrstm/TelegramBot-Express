const { Transaction } = require("../models");

const createTransaction = async (trBody) => {
  const createdTransaction = await Transaction.create(trBody);
  return await Transaction.findById(createdTransaction._id).populate("user").populate("order").populate("price");
};

const getLastPrice = async () => {
  return Admin.find();
};

const getUserTransactions = async (userId) => {
  return Transaction.find({ user: userId }).populate("user").populate("order").populate("price").limit(10);
};

module.exports = {
  getLastPrice,
  createTransaction,
  getUserTransactions,
};
