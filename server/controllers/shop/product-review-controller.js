const ProductReview = require("../../models/Review");
const Order = require("../../models/Order");
const Product = require("../../models/Product");

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } =
      req.body;
    // console.log(productId);
    const order = await Order.find({
      userId,
      "cartItems.productId": productId,
      orderStatus: "Confirmed",
    });

    if (!order.length) {
      return res.status(403).json({
        success: false,
        message: "You have to purchase product to review it.",
      });
    }
    // console.log(order);

    // return;

    const checkExistingReview = await ProductReview.findOne({
      productId,
      userId,
    });
    if (checkExistingReview) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product.",
      });
    }

    const newReview = new ProductReview({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });
    await newReview.save();

    // update product revire in product collection
    const reviews = await ProductReview.find({ productId });

    const totalReviewsLength = reviews.length;
    const averageReview =
      reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      totalReviewsLength;

    const updatedProduct = await Product.findByIdAndUpdate(productId, {
      averageReview,
    });
    res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await ProductReview.find({ productId });

    return res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

module.exports = { addProductReview, getProductReviews };
