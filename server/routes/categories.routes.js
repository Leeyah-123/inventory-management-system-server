const express = require('express');

const {
  getAllCategories,
  getCategoryById,
  addCategory,
  updateCategoryById,
  deleteCategoryById,
} = require('../controllers/categories.controller');

const validate = require('../middleware/validation');
const validationSchema = require('../utils/validationSchema');

const router = express.Router();

router.get('/api/categories', getAllCategories);
router.get('/api/categories/:id', getCategoryById);
router.post(
  '/api/categories',
  validate(validationSchema.category),
  addCategory
);
router.patch('/api/categories/:id', updateCategoryById);
router.delete(
  '/api/categories/:id',
  validate(validationSchema.category),
  deleteCategoryById
);

module.exports = router;
