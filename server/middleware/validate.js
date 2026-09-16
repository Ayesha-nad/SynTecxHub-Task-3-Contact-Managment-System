const { body, param, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Robust phone regex and length checker allowing international/local formats
const phoneRegex = /^[+]?[\d\s().-]{7,25}$/;

/**
 * Validation rules for Contact creation and update
 */
const contactValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Contact name is required.')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters long.'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required.')
    .isEmail()
    .withMessage('Please provide a valid email address (e.g. name@domain.com).')
    .normalizeEmail(),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required.')
    .custom((value) => {
      const digitsOnly = value.replace(/\D/g, '');
      if (!phoneRegex.test(value) || digitsOnly.length < 7 || digitsOnly.length > 16) {
        throw new Error('Please enter a valid phone number (e.g. +1 (555) 019-2834 or 0300-1234567).');
      }
      return true;
    }),

  body('address')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 250 })
    .withMessage('Address cannot exceed 250 characters.'),

  body('company')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters.'),

  body('jobTitle')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Job title cannot exceed 100 characters.'),

  body('tags')
    .optional()
    .custom((value) => {
      if (Array.isArray(value)) {
        if (value.length > 8) throw new Error('Maximum of 8 tags allowed per contact.');
        return true;
      }
      if (typeof value === 'string') return true;
      throw new Error('Tags must be an array of strings.');
    }),

  body('notes')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters.'),

  body('isFavorite')
    .optional()
    .isBoolean()
    .withMessage('isFavorite must be a boolean value (true or false).'),

  body('avatarColor')
    .optional()
    .matches(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
    .withMessage('Avatar color must be a valid hex color code.'),
];

/**
 * Validation rule for MongoDB ObjectId params (e.g. /api/contacts/:id)
 */
const validateObjectId = [
  param('id')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid contact ID format.');
      }
      return true;
    }),
];

/**
 * Middleware to check validation results and return formatted 400 response
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = {};
    errors.array().forEach((err) => {
      const field = err.path || err.param;
      if (!formattedErrors[field]) {
        formattedErrors[field] = err.msg;
      }
    });

    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please check the ink on your form.',
      errors: formattedErrors,
    });
  }
  next();
};

module.exports = {
  contactValidationRules,
  validateObjectId,
  handleValidationErrors,
};
