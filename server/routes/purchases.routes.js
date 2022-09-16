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
const { admin } = require('../middleware/roleBasedAuthorization');

const router = express.Router();

router.get('/api/purchases', getPurchases);
router.get('/api/purchases/:id', getPurchaseById);
router.post(
  '/api/purchases',
  admin,
  validate(validationSchema.purchase),
  makePurchase
);
router.patch(
  '/api/purchases/:id',
  admin,
  validate(validationSchema.purchase),
  updatePurchaseById
);
router.delete('/api/purchases/:id', admin, deletePurchaseById);

module.exports = router;
