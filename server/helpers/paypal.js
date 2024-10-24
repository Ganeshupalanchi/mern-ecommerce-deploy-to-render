const paypal = require("paypal-rest-sdkv2");
// const paypal = require("paypal-rest-sdkv2/lib/paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  clientId: process.env.PAYPAL_CLIENT_ID,
  clientSecret: process.env.PAYPAL_CLIENT_SECRET,
});

module.exports = paypal;
