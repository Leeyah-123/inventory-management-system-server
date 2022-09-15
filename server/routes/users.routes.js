const express = require('express');

const {
  getUsers,
  getUserById,
  updateUserRoleById,
  updateProfile,
  deleteUserById,
  deleteProfile,
} = require('../controllers/users.controller');

const router = express.Router();

const { admin } = require('../middleware/roleBasedAuthorization');

router.get('/api/users', admin, getUsers);
router.get('/api/users/:id', admin, getUserById);
router.patch('/api/users/:id', admin, updateUserRoleById);
router.patch('/api/users/profile', updateProfile);
router.delete('/api/users/:id', admin, deleteUserById);
router.delete('/api/users/profile', deleteProfile);

module.exports = router;
