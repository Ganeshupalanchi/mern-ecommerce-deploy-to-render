const express = require("express");

const {
  getAllOrders,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} = require("../../controllers/admin/order-controller");

const router = express.Router();
router.get("/getOrders", getAllOrders);
router.get("/details/:orderId", getOrderDetailsForAdmin);
router.put("/update/:orderId", updateOrderStatus);

module.exports = router;
