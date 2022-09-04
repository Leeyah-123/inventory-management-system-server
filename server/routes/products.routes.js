const express = require('express');

const {
  getAllProducts,
  getProductByCode,
  addProduct,
  updateProductByCode,
  deleteProductByCode,
} = require('../controllers/products.controller');

const { employee } = require('../middleware/roleBasedAuthorization');
const validate = require('../middleware/validation');
const validationSchema = require('../utils/validationSchema');

const router = express.Router();

router.get('/api/products', getAllProducts);
router.get('/api/products/:id', getProductByCode);
router.post(
  '/api/products',
  employee,
  validate(validationSchema.product),
  addProduct
);
router.patch(
  '/api/products/:id',
  employee,
  validate(validationSchema.product),
  updateProductByCode
);
router.delete('/api/products/:id', employee, deleteProductByCode);

module.exports = router;
