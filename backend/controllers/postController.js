const Post = require('../models/Post');
const { getPaging } = require('../utils/pagination');
const { buildPostFilters, buildSort } = require('../utils/postQuery');
const { success, created, paginated } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;

  const post = await Post.create({
    title,
    content,
    tags: tags || [],
    author: req.user.id,
  });

  await post.populate('author', 'name email');

  return created(res, { post }, 'Post created successfully');
});

// @desc    Get all posts with pagination and filtering
// @route   GET /api/posts
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaging(req.query);
  const {
    author,
    tags,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  const query = await buildPostFilters({ author, tags, search });
  const sortOptions = buildSort(sortBy, sortOrder);

  const [posts, total] = await Promise.all([
    Post.find(query)
      .populate('author', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments(query),
  ]);

  return paginated(res, posts, page, limit, total);
});

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'name email')
    .populate({
      path: 'comments',
      match: { isActive: true },
      populate: { path: 'author', select: 'name email' },
      options: { sort: { createdAt: -1 } },
    });

  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  if (
    !post.isPublished &&
    (!req.user || req.user.id !== post.author._id.toString())
  ) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  post.viewCount += 1;
  await post.save();

  return success(res, { post });
});

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private (Post owner or admin)
const updatePost = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return res
      .status(403)
      .json({ success: false, message: 'Not authorized to update this post' });
  }

  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    { title, content, tags: tags || post.tags },
    { new: true, runValidators: true }
  ).populate('author', 'name email');

  return success(res, { post: updatedPost }, 'Post updated successfully');
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (Post owner or admin)
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return res
      .status(403)
      .json({ success: false, message: 'Not authorized to delete this post' });
  }

  await Post.findByIdAndDelete(req.params.id);

  return success(res, {}, 'Post deleted successfully');
});

// @desc    Get posts by current user
// @route   GET /api/posts/my-posts
// @access  Private
const getMyPosts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaging(req.query);

  const [posts, total] = await Promise.all([
    Post.find({ author: req.user.id })
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments({ author: req.user.id }),
  ]);

  return paginated(res, posts, page, limit, total);
});

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  getMyPosts,
};
