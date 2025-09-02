const User = require('../models/User');

async function buildPostFilters({ author, tags, search }) {
  const query = { isPublished: true };

  if (author) {
    const authorUser = await User.findOne({
      $or: [
        { name: { $regex: author, $options: 'i' } },
        { email: { $regex: author, $options: 'i' } },
      ],
    });
    if (authorUser) {
      query.author = authorUser._id;
    }
  }

  if (tags) {
    const tagArray = String(tags)
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(Boolean);
    if (tagArray.length) {
      query.tags = { $in: tagArray };
    }
  }

  if (search) {
    query.$text = { $search: search };
  }

  return query;
}

function buildSort(sortBy = 'createdAt', sortOrder = 'desc') {
  return { [sortBy]: String(sortOrder).toLowerCase() === 'desc' ? -1 : 1 };
}

module.exports = { buildPostFilters, buildSort };
