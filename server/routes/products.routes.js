const express = require('express');

const {
  getAllProducts,
  getProductByCode,
  addProduct,
  uploadProductImage,
  updateProductByCode,
  updateProductImage,
  deleteProductByCode,
} = require('../controllers/products.controller');

const validate = require('../middleware/validation');
const validationSchema = require('../utils/validationSchema');
const upload = require('../utils/multer');

const router = express.Router();

router.get('/api/products', getAllProducts);
router.get('/api/products/:code', getProductByCode);
router.post('/api/products', validate(validationSchema.product), addProduct);
router.patch(
  '/api/products/:code',
  validate(validationSchema.product),
  updateProductByCode
);
router.post('/api/products/image', upload.single('image'), uploadProductImage);
router.patch(
  '/api/products/image/:code',
  upload.single('image'),
  updateProductImage
);
router.delete('/api/products/:code', deleteProductByCode);

module.exports = router;
