const express = require('express');

const {
  getAllCategories,
  getCategoryById,
  addCategory,
  updateCategoryById,
  deleteCategoryById,
} = require('../controllers/categories.controller');

const { employee } = require('../middleware/roleBasedAuthorization');
const validate = require('../middleware/validation');
const validationSchema = require('../utils/validationSchema');

const router = express.Router();

router.get('/api/categories', getAllCategories);
router.get('/api/categories/:id', getCategoryById);
router.post(
  '/api/categories',
  employee,
  validate(validationSchema.category),
  addCategory
);
router.patch('/api/categories/:id', employee, updateCategoryById);
router.delete(
  '/api/categories/:id',
  employee,
  validate(validationSchema.category),
  deleteCategoryById
);

module.exports = router;
