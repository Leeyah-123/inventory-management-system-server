const express = require('express');

const auth = require('../middleware/auth');
const {
  loginController,
  signupController,
  profileController,
} = require('../controllers/auth.controller');

const validate = require('../middleware/validation');
const validationSchema = require('../utils/validationSchema');

const router = express.Router();

router.post(
  '/api/auth/login',
  validate(validationSchema.login, 'body'),
  loginController
);
router.post(
  '/api/auth/signup',
  validate(validationSchema.user, 'body'),
  signupController
);
router.get('/api/auth/profile', auth, profileController);

module.exports = router;
