const express = require('express');

const {
  getSales,
  getSaleById,
  makeSale,
  updateSaleById,
  deleteSaleById,
} = require('../controllers/sales.controller');

const { employee } = require('../middleware/roleBasedAuthorization');
const validate = require('../middleware/validation');
const validationSchema = require('../utils/validationSchema');

const router = express.Router();

router.get('/api/sales', employee, getSales);
router.get('/api/sales/:id', employee, getSaleById);
router.post('/api/sales', employee, validate(validationSchema.sale), makeSale);
router.patch(
  '/api/sales/:id',
  employee,
  validate(validationSchema.sale),
  updateSaleById
);
router.delete('/api/sales/:id', employee, deleteSaleById);

module.exports = router;
