const express = require("express");
const { body } = require("express-validator");
const { protect } = require("../middleware/auth");
const { handleValidationErrors } = require("../middleware/validate");
const {
  addComment,
  getComments,
  updateComment,
  deleteComment,
  getMyComments,
} = require("../controllers/commentController");

const router = express.Router();

// Validation rules
const commentValidation = [
  body("content")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Comment must be between 1 and 1000 characters"),
];

// Routes
router.post("/posts/:postId/comments", protect, commentValidation, handleValidationErrors, addComment);
router.get("/posts/:postId/comments", getComments);
router.get("/my-comments", protect, getMyComments);
router.put("/:id", protect, commentValidation, handleValidationErrors, updateComment);
router.delete("/:id", protect, deleteComment);

module.exports = router; 