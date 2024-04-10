// productController.js

const Product = require('../models/Product');

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get a product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const image = req.file.filename; // Get the uploaded image filename
    const product = new Product({
      name,
      description,
      price,
      image,
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const image = req.file ? req.file.filename : undefined; // Check if an image was uploaded
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    product.name = name;
    product.description = description;
    product.price = price;
    if (image) {
      product.image = image;
    }
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.remove();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
// const deleteProduct = asyncWrapper(async (req, res, next) => {
//     let errorArray = [];
//     const filter = { _id: mongoose.Types.ObjectId(req.params.id) };
//     const update = { is_deleted: true };
//     update.updatedAt = moment().format('DD-MM-YYYY HH:mm:SS');
  
//     const result = await Product.findByIdAndUpdate(filter, update, { new: true });
  
//     if (!result) {
//       errorArray.push('Cannot delete product with id');
//       next(createCustomError(errorArray, 404, false, 'no'));
//       return;
//     }
  
//     res.send({ message: 'Product deleted successfully', result });
//   });
const Razorpay = require('razorpay');

// Create a new instance of Razorpay with your API Key and Secret Key
const razorpay = new Razorpay({
  key_id: 'YOUR_RAZORPAY_KEY_ID',
  key_secret: 'YOUR_RAZORPAY_KEY_SECRET',
});

// Buy a product by ID
const buyProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // Generate an order ID using the Razorpay API
    const options = {
      amount: 100, // Amount in paise (e.g., for ₹100, provide 10000)
      currency: 'INR',
      receipt: 'order_receipt',
      payment_capture: 1, // 1 - Auto Capture, 0 - Manual Capture
    };

    const order = await razorpay.orders.create(options);

    res.json({ orderId: order.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  buyProduct,
};
const addToCart = async (req, res) => {
    try {
      const { productId } = req.params;
      const { quantity } = req.body;
  
      // Find the user based on the authenticated user's ID
      const user = await User.findById(req.userId);
  
      // Find the product to add to the cart based on the product ID
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // Create a cart item object with the product details
      const cartItem = {
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity: quantity,
      };
  
      // Add the cart item to the user's cart
      user.cart.push(cartItem);
  
      // Save the user's updated cart
      await user.save();
  
      res.json({ message: 'Product added to cart successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  buyProduct,
  addToCart
};
