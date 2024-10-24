const Order = require("../../models/Order");

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ _id: -1 });

    if (!orders.length) {
      return res
        .status(400)
        .json({ success: false, message: "No orders found!" });
    }

    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Some error occured." });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { orderId } = req.params;
    const orderDetails = await Order.findById(orderId);

    if (!orderDetails) {
      return res
        .status(400)
        .json({ success: false, message: "Order details not found!" });
    }

    return res.status(200).json({ success: true, data: orderDetails });
  } catch (error) {
    res.status(500).json({ success: false, message: "Some error occured." });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;
    const orderDetails = await Order.findById(orderId);

    if (!orderDetails) {
      return res
        .status(400)
        .json({ success: false, message: "Order details not found!" });
    }
    await Order.findByIdAndUpdate(orderId, { orderStatus });

    return res
      .status(200)
      .json({ success: true, message: "Order status is updated." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Some error occured." });
  }
};

module.exports = { getAllOrders, getOrderDetailsForAdmin, updateOrderStatus };
