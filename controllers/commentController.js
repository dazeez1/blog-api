const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @desc    Add comment to a post
// @route   POST /api/posts/:postId/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    // Check if post exists and is published
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    if (!post.isPublished) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const comment = await Comment.create({
      content,
      author: req.user.id,
      post: postId,
    });

    // Populate author details
    await comment.populate('author', 'name email');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { comment },
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get comments for a post
// @route   GET /api/posts/:postId/comments
// @access  Public
const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [comments, total] = await Promise.all([
      Comment.find({
        post: postId,
        isActive: true,
      })
        .populate('author', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Comment.countDocuments({
        post: postId,
        isActive: true,
      }),
    ]);

    const totalPages = Math.ceil(total / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.status(200).json({
      success: true,
      data: {
        comments,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: total,
          itemsPerPage: limitNum,
          hasNextPage,
          hasPrevPage,
        },
      },
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private (Comment owner)
const updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check if user is authorized to update
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment',
      });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { content },
      {
        new: true,
        runValidators: true,
      }
    ).populate('author', 'name email');

    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      data: { comment: updatedComment },
    });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private (Comment owner or admin)
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check if user is authorized to delete
    if (
      comment.author.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment',
      });
    }

    // Soft delete by setting isActive to false
    comment.isActive = false;
    await comment.save();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get comments by current user
// @route   GET /api/comments/my-comments
// @access  Private
const getMyComments = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [comments, total] = await Promise.all([
      Comment.find({
        author: req.user.id,
        isActive: true,
      })
        .populate('author', 'name email')
        .populate('post', 'title')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Comment.countDocuments({
        author: req.user.id,
        isActive: true,
      }),
    ]);

    const totalPages = Math.ceil(total / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.status(200).json({
      success: true,
      data: {
        comments,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: total,
          itemsPerPage: limitNum,
          hasNextPage,
          hasPrevPage,
        },
      },
    });
  } catch (error) {
    console.error('Get my comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

module.exports = {
  addComment,
  getComments,
  updateComment,
  deleteComment,
  getMyComments,
};
