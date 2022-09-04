const express = require('express');

const {
  getUsers,
  getUserById,
  updateUserById,
  deleteProfileById,
} = require('../controllers/users.controller');

const router = express.Router();

const { admin } = require('../middleware/roleBasedAuthorization');

router.get('/api/users', admin, getUsers);
router.get('/api/users/:id', getUserById);
router.patch('/api/users/:id', updateUserById);
router.delete('/api/users/:id', deleteProfileById);

module.exports = router;
