const express = require('express');

const {
  getUsers,
  getUserById,
  updateUserRoleById,
  deleteUserById,
} = require('../controllers/users.controller');

const router = express.Router();

const { admin } = require('../middleware/roleBasedAuthorization');

router.get('/api/users', admin, getUsers);
router.get('/api/users/:id', admin, getUserById);
router.patch('/api/users/:id', admin, updateUserRoleById);
router.delete('/api/users/:id', admin, deleteUserById);

module.exports = router;
