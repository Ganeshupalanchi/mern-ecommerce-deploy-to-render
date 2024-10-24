const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

const handleImageUpload = async (req, res) => {
  try {
    // console.log(req.file);

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    // console.log(b64);

    const url = "data:" + req.file.mimetype + ";base64," + b64;

    const result = await imageUploadUtil(url);
    res.json({ success: true, result });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error occured." });
  }
};

// add new product
const addProduct = async (req, res) => {
  const {
    image,
    title,
    description,
    category,
    brand,
    price,
    salePrice,
    totalStock,
  } = req.body;
  try {
    const newProduct = new Product({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    });

    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Occured",
    });
  }
};

//fetch all product
const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find();
    res.status(200).json({ success: true, data: listOfProducts });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Occured",
    });
  }
};

//edit a product
const editProduct = async (req, res) => {
  const { id } = req.params;
  const {
    image,
    title,
    description,
    category,
    brand,
    price,
    salePrice,
    totalStock,
  } = req.body;
  try {
    let findProduct = await Product.findById(id);
    if (!findProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    findProduct.image = image || findProduct.image;
    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.price = price === "" ? 0 : price || findProduct.price;
    findProduct.salePrice =
      salePrice === "" ? 0 : salePrice || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;

    await findProduct.save();
    res.status(200).json({
      success: true,
      data: findProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Occured",
    });
  }
};

// delete a product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Occured",
    });
  }
};
module.exports = {
  handleImageUpload,
  deleteProduct,
  editProduct,
  addProduct,
  fetchAllProducts,
};
