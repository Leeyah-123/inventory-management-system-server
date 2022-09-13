const express = require('express');

const {
  getSales,
  getSaleById,
  makeSale,
  updateSaleById,
  deleteSaleById,
} = require('../controllers/sales.controller');

const validate = require('../middleware/validation');
const validationSchema = require('../utils/validationSchema');

const router = express.Router();

router.get('/api/sales', getSales);
router.get('/api/sales/:id', getSaleById);
router.post('/api/sales', validate(validationSchema.sale), makeSale);
router.patch('/api/sales/:id', validate(validationSchema.sale), updateSaleById);
router.delete('/api/sales/:id', deleteSaleById);

module.exports = router;
