const Product = require("../models/Product");
const Firm = require("../models/Firm");
const multer = require("multer");
const path = require("path");

// Define Storage for Multer
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  },
});

// Multer Upload
const upload = multer({ storage: storage });

const addProduct = async (req, res) => {
  try {
    const { productName, price, category, des } = req.body;
    const img = req.file ? req.file.filename : undefined;
    const firmId = req.params.firmId;

    // Validate firmId
    if (!firmId || firmId === "null" || firmId === "undefined") {
      return res.status(400).json({ error: "Invalid firm ID" });
    }

    const firmData = await Firm.findById(firmId);
    if (!firmData) {
      return res.status(404).json({ error: "Firm not found" });
    }

    const product = new Product({
      productName,
      price,
      category,
      img,
      des,
      firm: firmData._id,
    });

    const saveProduct = await product.save();

    // Ensure products array exists before pushing
    if (!firmData.products) {
      firmData.products = [];
    }
    firmData.products.push(saveProduct);
    await firmData.save();

    res.status(200).json({ saveProduct });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get products by firm ID
const getProductById = async (req, res) => {
  try {
    const firmId = req.params.firmId;
    const firmData = await Firm.findById(firmId);

    if (!firmData) {
      return res.status(404).json({ error: "Firm not found" });
    }

    const products = await Product.find({ firm: firmData._id });
    const restaurantName = Firm.firmName;

    res.status(200).json({restaurantName,products});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Delete product by ID
const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {addProduct: [upload.single("image"), addProduct],getProductById,deleteProductById,};
