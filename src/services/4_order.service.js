const { Order } = require("../models");

const createOrder = async (orderBody) => {
  const createdOrder = await Order.create(orderBody);
  return await Order.findById(createdOrder._id).populate("user").populate("price");
};

const updateOrder = async (userBody, orderId) => {
  const foundOrder = await Order.findById(orderId).populate("user").populate("price");
  foundOrder.performed = true;
  foundOrder.isVerified = userBody.isVerified;
  const updatedOrder = await foundOrder.save();
  return updatedOrder;
};

const getOneOrder = async (orderId) => {
  return Order.findById(orderId).populate("user").populate("price");
};

const getAllUnverifiedOrders = async () => {
  return Order.find({ isVerified: false }).populate("user").populate("price");
};

const getAllVerifiedOrders = async () => {
  return Order.find({ isVerified: true }).populate("user").populate("price");
};

module.exports = {
  createOrder,
  updateOrder,
  getOneOrder,
  getAllVerifiedOrders,
  getAllUnverifiedOrders,
};
