const express = require('express');
const { protect } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validate');
const {
  addComment,
  getComments,
  updateComment,
  deleteComment,
  getMyComments,
} = require('../controllers/commentController');
const { commentValidation } = require('../validators/comments');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment management
 */

router.post(
  '/posts/:postId/comments',
  protect,
  commentValidation,
  handleValidationErrors,
  addComment
);

router.get('/posts/:postId/comments', getComments);

router.get('/my-comments', protect, getMyComments);

router.put(
  '/:id',
  protect,
  commentValidation,
  handleValidationErrors,
  updateComment
);

router.delete('/:id', protect, deleteComment);

module.exports = router;
