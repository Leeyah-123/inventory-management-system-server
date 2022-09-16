const express = require('express');

const {
  getUsers,
  getUserById,
  confirmPassword,
  updateUserRoleById,
  updateProfile,
  updateProfileImage,
  deleteProfileImage,
  deleteUserById,
  deleteProfile,
} = require('../controllers/users.controller');

const router = express.Router();

const upload = require('../utils/multer');
const validate = require('../middleware/validation');
const validationSchema = require('../utils/validationSchema');

const { admin } = require('../middleware/roleBasedAuthorization');

router.get('/api/users', admin, getUsers);
router.get('/api/users/:id', admin, getUserById);
router.post('/api/user/confirmPassword', confirmPassword);
router.patch('/api/users/:id', admin, updateUserRoleById);
router.patch(
  '/api/user/profile',
  validate(validationSchema.profile),
  updateProfile
);
router.patch(
  '/api/user/profile/image',
  upload.single('image'),
  updateProfileImage
);
router.delete('/api/users/:id', admin, deleteUserById);
router.delete('/api/user/profile', deleteProfile);
router.delete('/api/user/profile/image', deleteProfileImage);

module.exports = router;
