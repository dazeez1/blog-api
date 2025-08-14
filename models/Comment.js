const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
      minlength: [1, "Comment cannot be empty"],
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ author: 1 });

// Ensure author and post exist before saving
commentSchema.pre("save", async function (next) {
  const User = mongoose.model("User");
  const Post = mongoose.model("Post");

  try {
    const [user, post] = await Promise.all([
      User.findById(this.author),
      Post.findById(this.post),
    ]);

    if (!user) {
      throw new Error("Author not found");
    }

    if (!post) {
      throw new Error("Post not found");
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Comment", commentSchema); 