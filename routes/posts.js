const express = require('express');
const { body } = require('express-validator');
const { protect, optionalAuth } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validate');
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  getMyPosts,
} = require('../controllers/postController');

const router = express.Router();

// Validation rules
const createPostValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters long'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Each tag must be a string with maximum 20 characters'),
];

const updatePostValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters long'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Each tag must be a string with maximum 20 characters'),
];

// Routes
router.post(
  '/',
  protect,
  createPostValidation,
  handleValidationErrors,
  createPost
);
router.get('/', optionalAuth, getPosts);
router.get('/my-posts', protect, getMyPosts);
router.get('/:id', optionalAuth, getPost);
router.put(
  '/:id',
  protect,
  updatePostValidation,
  handleValidationErrors,
  updatePost
);
router.delete('/:id', protect, deletePost);

module.exports = router;
