const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    if (!userId || !productId || quantity <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid data provided." });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      cart.items.push({ productId, quantity });
    } else {
      cart.items[findCurrentProductIndex].quantity += quantity;
    }
    await cart.save();

    return res
      .status(200)
      .json({ success: true, message: "Product added to cart", data: cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// fetch cart products
const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User is mandatory." });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice totalStock",
    });
    // console.log(cart);

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found." });
    }

    const validItems = cart.items.filter(
      (productItem) => productItem.productId
    );
    // console.log(validItems);
    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const populateCartItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      totalStock: item.productId.totalStock,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

//
const updateCartItemsQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    // console.log(userId, productId, quantity);

    if (!userId || !productId || quantity <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid data provided." });
    }
    const cart = await Cart.findOne({ userId });
    // console.log(cart);

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found." });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    // console.log(findCurrentProductIndex);

    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item is not present.",
      });
    }
    cart.items[findCurrentProductIndex].quantity = quantity;
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });
    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId?._id,
      image: item.productId?.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    // console.log((userId, productId));

    if (!userId || !productId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid data provided." });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice totalStock",
    });
    if (!cart) {
      return res
        .status(404)
        .json({ success: true, message: "Cart not found." });
    }

    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId
    );

    await cart.save();
    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId && item.productId?._id,
      image: item.productId && item.productId?.image,
      title: item.productId && item.productId.title,
      price: item.productId && item.productId.price,
      salePrice: item.productId && item.productId.salePrice,
      totalStock: item.productId.totalStock,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = {
  addToCart,
  updateCartItemsQty,
  fetchCartItems,
  deleteCartItem,
};
