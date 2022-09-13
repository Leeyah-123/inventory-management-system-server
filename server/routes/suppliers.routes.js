const express = require('express');

const {
  getSuppliers,
  getSupplierById,
  addSupplier,
  updateSupplierById,
  deleteSupplierById,
} = require('../controllers/suppliers.controller');

const router = express.Router();

const { admin } = require('../middleware/roleBasedAuthorization');
const validate = require('../middleware/validation');
const validationSchema = require('../utils/validationSchema');

router.get('/api/suppliers', getSuppliers);
router.get('/api/suppliers/:id', getSupplierById);
router.post(
  '/api/suppliers',
  admin,
  validate(validationSchema.supplier),
  addSupplier
);
router.patch(
  '/api/suppliers/:id',
  admin,
  validate(validationSchema.supplier),
  updateSupplierById
);
router.delete('/api/suppliers/:id', admin, deleteSupplierById);

module.exports = router;
