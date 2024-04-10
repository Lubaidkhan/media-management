const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');

const Constants = require('../Constants');

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, Constants.rootUploads + 'Products/');
  },
  filename: function (req, file, cb) {
    const extArray = file.mimetype.split("/");
    const extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + '-' + Date.now() + '.' + extension);
  }
});
const upload = multer({ storage: storage });

// Get all products
router.get('/', ProductController.getAllProducts);

// Get a product by ID
router.get('/:id', ProductController.getProductById);

// Create a new product
router.post('/create', upload.single('image'), ProductController.createProduct);

// Update a product
router.put('/:id', upload.single('image'), ProductController.updateProduct);

// Delete a product
router.delete('/:id', ProductController.deleteProduct);
// Buy a product by ID
router.post('/:id/buy', ProductController.buyProduct);
router.post('/cart/add/:productId', ProductController.addToCart);


module.exports = router;
