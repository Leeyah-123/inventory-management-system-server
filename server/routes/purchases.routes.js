const express = require('express');

const {
  getPurchases,
  getPurchaseById,
  makePurchase,
  updatePurchaseById,
  deletePurchaseById,
} = require('../controllers/purchases.controller');

const { employee } = require('../middleware/roleBasedAuthorization');
const validate = require('../middleware/validation');
const validationSchema = require('../utils/validationSchema');

const router = express.Router();

router.get('/api/purchases', employee, getPurchases);
router.get('/api/purchases/:id', employee, getPurchaseById);
router.post(
  '/api/purchases',
  employee,
  validate(validationSchema.purchase),
  makePurchase
);
router.patch(
  '/api/purchases/:id',
  employee,
  validate(validationSchema.purchase),
  updatePurchaseById
);
router.delete('/api/purchases/:id', employee, deletePurchaseById);

module.exports = router;
