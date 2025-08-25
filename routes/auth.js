const express = require('express');
const { protect } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validate');
const {
  signup,
  login,
  getMe,
  updateProfile,
} = require('../controllers/userController');
const {
  signupValidation,
  loginValidation,
  updateProfileValidation,
} = require('../validators/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

// Routes
router.post('/signup', signupValidation, handleValidationErrors, signup);

router.post('/login', loginValidation, handleValidationErrors, login);

router.get('/me', protect, getMe);

router.put(
  '/me',
  protect,
  updateProfileValidation,
  handleValidationErrors,
  updateProfile
);

module.exports = router;
