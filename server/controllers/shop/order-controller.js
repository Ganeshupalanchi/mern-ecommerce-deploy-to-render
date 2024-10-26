const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const axios = require("axios");
const qs = require("qs"); // For form URL encoding
const Product = require("../../models/Product");

const getAccessToken = async () => {
  const clientId =
    "Ac8psSK-hOnog60pSHhCfvEV0sufAMiQQLw06Ak0acq-T1xcEA9G-aAhhE6arrNPgMaMcwY01xB0sz10";
  const clientSecret =
    "EIOrFivyLuh4jnJIXo9cpJn1wfZbu_jtbzGENV82axX0tConAp5FcKpy9ShvarNS2r_rfgNzDBMOWE6R";

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const response = await axios.post(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      qs.stringify({ grant_type: "client_credentials" }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${auth}`,
        },
      }
    );

    return response.data.access_token; // Return the access token
  } catch (error) {
    console.error("Error getting PayPal access token:", error);
    throw new Error("Could not authenticate with PayPal.");
  }
};

const createOrder = async (req, res) => {
  const accessToken = await getAccessToken();
  // const currency = "USD";
  const {
    userId,
    cartId,
    cartItems,
    addressInfo,
    orderStatus,
    paymentMethod,
    paymentStatus,
    totalAmount,
    orderDate,
    orderUpdateDate,
    paymentId,
    payerId,
  } = req.body;

  try {
    const create_payment_json = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: totalAmount.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: totalAmount.toFixed(2),
              },
            },
          },
          items: cartItems.map((item) => ({
            name: item.title,
            unit_amount: {
              currency_code: "USD",
              value: item.price.toFixed(2),
            },
            quantity: item.quantity,
          })),
        },
      ],
      application_context: {
        return_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-return`,
        cancel_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-cancel`,
      },
    };

    const response = await axios.post(
      "https://api-m.sandbox.paypal.com/v2/checkout/orders",
      create_payment_json,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const approvalURL = response.data.links.find(
      (link) => link.rel === "approve"
    ).href;

    const paypalOrderId = response.data.id;

    // Save order details to your database
    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paypalOrderId,
      paymentId,
      payerId,
    });

    await newlyCreatedOrder.save();

    // Respond with approval URL and order ID
    res.status(201).json({
      success: true,
      approvalURL,
      orderId: newlyCreatedOrder._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Some error occured." });
  }
};

const capturePayment = async (req, res) => {
  //   const accessToken = await getAccessToken();
  const accessToken = await getAccessToken();

  const { token, payerId } = req.body; // PayPal order ID (token)
  // console.log(token, payerId);

  try {
    const response = await axios.post(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${token}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const captureDetails = response.data;
    // console.log(captureDetails);

    let order = await Order.findOne({ paypalOrderId: token });
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    order.orderStatus = "Confirmed";
    order.paymentStatus = "Paid";
    order.paymentId = captureDetails.id; // PayPal payment ID
    order.payerId = captureDetails.payer.payer_id; // PayPal payer ID
    order.orderUpdateDate = new Date();

    for (const item of order.cartItems) {
      let product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${product.title}`,
        });
      }
      // console.log(product.totalStock);
      // console.log(item.quantity);

      product.totalStock -= item.quantity;
      await product.save();
    }

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment captured successfully!",
      data: order,
      paymentInfo: captureDetails,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ success: false, message: "Some error occured." });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ _id: -1 });

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
const getOrderDetails = async (req, res) => {
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

module.exports = {
  createOrder,
  capturePayment,
  getOrderDetails,
  getAllOrdersByUser,
};
