const { body } = require('express-validator');

const commentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters'),
];

module.exports = { commentValidation };
