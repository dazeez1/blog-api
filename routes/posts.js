const express = require('express');
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
const {
  createPostValidation,
  updatePostValidation,
} = require('../validators/posts');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Blog post management
 */

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
