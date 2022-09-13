const express = require('express');

const {
  getPurchases,
  getPurchaseById,
  makePurchase,
  updatePurchaseById,
  deletePurchaseById,
} = require('../controllers/purchases.controller');

const validate = require('../middleware/validation');
const validationSchema = require('../utils/validationSchema');

const router = express.Router();

router.get('/api/purchases', getPurchases);
router.get('/api/purchases/:id', getPurchaseById);
router.post(
  '/api/purchases',
  validate(validationSchema.purchase),
  makePurchase
);
router.patch(
  '/api/purchases/:id',
  validate(validationSchema.purchase),
  updatePurchaseById
);
router.delete('/api/purchases/:id', deletePurchaseById);

module.exports = router;
