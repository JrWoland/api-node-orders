const express = require('express');

const router = express.Router();

const mongsoose = require('mongoose');

const multer = require('multer');

const ProductsController = require('../controllers/ProductsController');

const checkAuth = require('../auth/check-auth');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/images');
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix} ${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fieldSize: 1024 * 1024
  }
});

router.get('/', ProductsController.getAllProducts);

router.post(
  '/',
  checkAuth,
  upload.single('productImage'),
  ProductsController.createdProduct
);

router.get('/:productId', ProductsController.getProductById);

router.patch('/:productId', checkAuth, ProductsController.updateProduct);

router.delete('/:productId', checkAuth, ProductsController.deleteProduct);

module.exports = router;
