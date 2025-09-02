const Comment = require('../models/Comment');
const Post = require('../models/Post');
const asyncHandler = require('../utils/asyncHandler');
const { success, created, paginated } = require('../utils/apiResponse');
const { getPaging } = require('../utils/pagination');

// @desc    Add comment to a post
// @route   POST /api/posts/:postId/comments
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { postId } = req.params;

  const post = await Post.findById(postId);
  if (!post || !post.isPublished) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  const comment = await Comment.create({
    content,
    author: req.user.id,
    post: postId,
  });
  await comment.populate('author', 'name email');

  return created(res, { comment }, 'Comment added successfully');
});

// @desc    Get comments for a post
// @route   GET /api/posts/:postId/comments
// @access  Public
const getComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { page, limit, skip } = getPaging(req.query);

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  const [comments, total] = await Promise.all([
    Comment.find({ post: postId, isActive: true })
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Comment.countDocuments({ post: postId, isActive: true }),
  ]);

  return paginated(res, comments, page, limit, total);
});

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private (Comment owner)
const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { id } = req.params;

  const comment = await Comment.findById(id);
  if (!comment) {
    return res
      .status(404)
      .json({ success: false, message: 'Comment not found' });
  }

  if (comment.author.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this comment',
    });
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    id,
    { content },
    { new: true, runValidators: true }
  ).populate('author', 'name email');

  return success(
    res,
    { comment: updatedComment },
    'Comment updated successfully'
  );
});

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private (Comment owner or admin)
const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findById(id);
  if (!comment) {
    return res
      .status(404)
      .json({ success: false, message: 'Comment not found' });
  }

  if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this comment',
    });
  }

  comment.isActive = false;
  await comment.save();

  return success(res, {}, 'Comment deleted successfully');
});

// @desc    Get comments by current user
// @route   GET /api/comments/my-comments
// @access  Private
const getMyComments = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaging(req.query);

  const [comments, total] = await Promise.all([
    Comment.find({ author: req.user.id, isActive: true })
      .populate('author', 'name email')
      .populate('post', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Comment.countDocuments({ author: req.user.id, isActive: true }),
  ]);

  return paginated(res, comments, page, limit, total);
});

module.exports = {
  addComment,
  getComments,
  updateComment,
  deleteComment,
  getMyComments,
};
