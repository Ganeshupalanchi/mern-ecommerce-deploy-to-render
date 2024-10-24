const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-route");

const adminProductRouter = require("./routes/admin/products-route");
const adminOrderRouter = require("./routes/admin/order-routes");

const cartRouter = require("./routes/shop/cart-route");
const addressRouter = require("./routes/shop/address-route");
const shopProductsRouter = require("./routes/shop/products-route");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-route");
const shopReviewRouter = require("./routes/shop/review-routes");
const commonFeatureRouter = require("./routes/common/feature-routes");

const { authMiddleware } = require("./controllers/auth/auth-controller");

require("dotenv").config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected."))
  .catch((error) => console.log(error));

const app = express();
const port = process.env.PORT || 5000;
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductRouter);
app.use("/api/admin/order", adminOrderRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", cartRouter);
app.use("/api/shop/address", addressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);

app.use("/api/common/feature", commonFeatureRouter);

app.listen(port, () => console.log("Server is running on port : " + port));
