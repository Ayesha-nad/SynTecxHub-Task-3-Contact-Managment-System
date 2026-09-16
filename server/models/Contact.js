const mongoose = require('mongoose');

// Email regex validator following RFC 5322 standard
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Phone regex allowing common international and local formats: +1 (555) 123-4567, 0300-1234567, +44 20 7946 0912
const phoneRegex = /^[+]?[\d\s().-]{7,25}$/;

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Contact name is required.'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long.'],
      maxlength: [100, 'Name cannot exceed 100 characters.'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required.'],
      trim: true,
      lowercase: true,
      unique: true,
      match: [emailRegex, 'Please provide a valid email address (e.g. name@domain.com).'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required.'],
      trim: true,
      match: [phoneRegex, 'Please provide a valid phone number (e.g. +1 (555) 019-2834).'],
    },
    address: {
      type: String,
      trim: true,
      maxlength: [250, 'Address cannot exceed 250 characters.'],
      default: '',
    },
    company: {
      type: String,
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters.'],
      default: '',
    },
    jobTitle: {
      type: String,
      trim: true,
      maxlength: [100, 'Job title cannot exceed 100 characters.'],
      default: '',
    },
    tags: {
      type: [String],
      default: ['General'],
      validate: {
        validator: function (tags) {
          return Array.isArray(tags) && tags.length <= 8;
        },
        message: 'A contact can have at most 8 tags.',
      },
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters.'],
      default: '',
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    avatarColor: {
      type: String,
      default: '#7a8c6f', // Sage green default wax seal color
      enum: [
        '#7a8c6f', // Sage Green
        '#d97757', // Muted Coral / Terracotta
        '#e0a750', // Soft Mustard Gold
        '#5a738e', // Vintage Navy
        '#8c6d7a', // Dusty Rose
        '#6b8071', // Forest Moss
        '#a06d4e', // Burnt Amber
        '#4a5568', // Antique Charcoal
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Text indexes for high performance search across Name, Email, Company, Address, Notes
contactSchema.index({ name: 'text', email: 'text', company: 'text', address: 'text', notes: 'text' });

// Virtual for initials (used on stationery wax seal)
contactSchema.virtual('initials').get(function () {
  if (!this.name) return '??';
  const parts = this.name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
});

// Configure JSON serialization to include virtuals
contactSchema.set('toJSON', { virtuals: true });
contactSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Contact', contactSchema);
