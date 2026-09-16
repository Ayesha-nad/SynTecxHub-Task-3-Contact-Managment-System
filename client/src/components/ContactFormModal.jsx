import React, { useState, useEffect } from 'react';
import { QuillIcon, StampIcon } from './Icons';
import { X, Plus, Check, Star, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const WAX_COLORS = [
  { hex: '#7a8c6f', name: 'Sage Green' },
  { hex: '#d97757', name: 'Muted Coral' },
  { hex: '#e0a750', name: 'Mustard Gold' },
  { hex: '#5a738e', name: 'Vintage Navy' },
  { hex: '#8c6d7a', name: 'Dusty Rose' },
  { hex: '#6b8071', name: 'Forest Moss' },
  { hex: '#a06d4e', name: 'Burnt Amber' },
  { hex: '#4a5568', name: 'Antique Charcoal' },
];

const PRESET_TAGS = ['Work', 'Family', 'Friends', 'VIP', 'Creative', 'Supplier', 'Acquaintance'];

// Regex matching backend
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^[+]?[\d\s().-]{7,25}$/;

export const ContactFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) => {
  const isEditing = Boolean(initialData && initialData._id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    address: '',
    tags: ['General'],
    notes: '',
    isFavorite: false,
    avatarColor: '#7a8c6f',
  });

  const [customTagInput, setCustomTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate or reset form
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        company: initialData.company || '',
        jobTitle: initialData.jobTitle || '',
        address: initialData.address || '',
        tags: Array.isArray(initialData.tags) && initialData.tags.length > 0 ? initialData.tags : ['General'],
        notes: initialData.notes || '',
        isFavorite: Boolean(initialData.isFavorite),
        avatarColor: initialData.avatarColor || '#7a8c6f',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        jobTitle: '',
        address: '',
        tags: ['General'],
        notes: '',
        isFavorite: false,
        avatarColor: '#7a8c6f',
      });
    }
    setErrors({});
    setTouched({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Validate form client-side
  const validate = (values) => {
    const errs = {};

    if (!values.name || !values.name.trim()) {
      errs.name = 'Contact name is required.';
    } else if (values.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters long.';
    } else if (values.name.trim().length > 100) {
      errs.name = 'Name cannot exceed 100 characters.';
    }

    if (!values.email || !values.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(values.email.trim())) {
      errs.email = 'Please provide a valid email (e.g. name@domain.com).';
    }

    const digitsOnly = (values.phone || '').replace(/\D/g, '');
    if (!values.phone || !values.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!phoneRegex.test(values.phone.trim()) || digitsOnly.length < 7 || digitsOnly.length > 16) {
      errs.phone = 'Please enter a valid phone number (e.g. +1 (555) 019-2834).';
    }

    if (values.notes && values.notes.length > 1000) {
      errs.notes = 'Notes cannot exceed 1000 characters.';
    }

    return errs;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const currentErrors = validate(formData);
    if (currentErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: currentErrors[field] }));
    }
  };

  // Tag toggling
  const handleToggleTag = (tag) => {
    setFormData((prev) => {
      const exists = prev.tags.includes(tag);
      let updated;
      if (exists) {
        updated = prev.tags.filter((t) => t !== tag);
        if (updated.length === 0) updated = ['General'];
      } else {
        updated = [...prev.tags.filter((t) => t !== 'General'), tag];
      }
      return { ...prev, tags: updated };
    });
  };

  const handleAddCustomTag = (e) => {
    e.preventDefault();
    if (!customTagInput.trim()) return;
    const cleanTag = customTagInput.trim();
    if (!formData.tags.includes(cleanTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags.filter((t) => t !== 'General'), cleanTag],
      }));
    }
    setCustomTagInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched({
        name: true,
        email: true,
        phone: true,
        notes: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await onSubmit(formData);
      if (result && !result.success) {
        if (result.errors) {
          setErrors(result.errors);
        }
      } else {
        if (!isEditing) {
          try {
            confetti({
              particleCount: 30,
              spread: 60,
              origin: { y: 0.7 },
              colors: ['#7a8c6f', '#e0a750', '#d97757', '#3b2a1e'],
            });
          } catch (cErr) {
            // Ignore
          }
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-sheet stitched-border"
        style={{ maxWidth: '640px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Washi Tape Header */}
        <div className="washi-tape washi-tape-mustard" />

        {/* Modal Title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px double rgba(59, 42, 30, 0.2)',
            paddingBottom: '12px',
            marginBottom: '16px',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-sage-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid var(--accent-sage-dark)',
                flexShrink: 0,
              }}
            >
              <QuillIcon size={18} className="text-espresso" />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h2 style={{ fontSize: '18px', margin: 0, wordBreak: 'break-word' }}>
                {isEditing ? 'Revise Rolodex Ledger' : 'Inscribe New Contact'}
              </h2>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                {isEditing ? 'Update filed credentials.' : 'Record a new page in your address book.'}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="icon-action-btn" title="Cancel">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Wax Seal Color Picker */}
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label">
              <span>Wax Seal Tint</span>
            </label>
            <div className="color-swatches-grid">
              {WAX_COLORS.map((col) => (
                <button
                  type="button"
                  key={col.hex}
                  className={`color-swatch-btn ${formData.avatarColor === col.hex ? 'selected' : ''}`}
                  style={{ backgroundColor: col.hex }}
                  onClick={() => handleChange('avatarColor', col.hex)}
                  title={col.name}
                />
              ))}
            </div>
          </div>

          {/* Name Field */}
          <div className="form-group">
            <label className="form-label">
              <span>Full Name <span className="required-dot">*</span></span>
            </label>
            <input
              type="text"
              className={`stationery-input ${errors.name && touched.name ? 'ink-error-input' : ''}`}
              placeholder="e.g. Arthur Pendelton"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
            />
            {errors.name && touched.name && (
              <div className="ink-error-msg">
                <AlertCircle size={13} />
                <span>{errors.name}</span>
              </div>
            )}
          </div>

          {/* Email & Phone Two Column */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">
                <span>Email Address <span className="required-dot">*</span></span>
              </label>
              <input
                type="email"
                className={`stationery-input ${errors.email && touched.email ? 'ink-error-input' : ''}`}
                placeholder="name@domain.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
              />
              {errors.email && touched.email && (
                <div className="ink-error-msg">
                  <AlertCircle size={13} />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Phone Field */}
            <div className="form-group">
              <label className="form-label">
                <span>Telephone <span className="required-dot">*</span></span>
              </label>
              <input
                type="tel"
                className={`stationery-input ${errors.phone && touched.phone ? 'ink-error-input' : ''}`}
                placeholder="+1 (555) 019-2834"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
              />
              {errors.phone && touched.phone && (
                <div className="ink-error-msg">
                  <AlertCircle size={13} />
                  <span>{errors.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Company & Job Title */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">
                <span>Company / Guild</span>
              </label>
              <input
                type="text"
                className="stationery-input"
                placeholder="e.g. Pendelton Rare Books"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Job Title / Craft</span>
              </label>
              <input
                type="text"
                className="stationery-input"
                placeholder="e.g. Master Bookbinder"
                value={formData.jobTitle}
                onChange={(e) => handleChange('jobTitle', e.target.value)}
              />
            </div>
          </div>

          {/* Physical Address */}
          <div className="form-group">
            <label className="form-label">
              <span>Physical Address</span>
            </label>
            <input
              type="text"
              className="stationery-input"
              placeholder="e.g. 42 Old Quill Lane, Oxford, OX1 2BE"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>

          {/* Tags Selection */}
          <div className="form-group">
            <label className="form-label">
              <span>Categories & Tags</span>
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '8px' }}>
              {PRESET_TAGS.map((tag) => {
                const isSelected = formData.tags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    className={`tag-pill ${isSelected ? `tag-${tag}` : ''}`}
                    onClick={() => handleToggleTag(tag)}
                    style={{
                      borderStyle: isSelected ? 'solid' : 'dashed',
                      fontWeight: isSelected ? '800' : '600',
                      transform: isSelected ? 'scale(1.05)' : 'none',
                    }}
                  >
                    {isSelected && <Check size={11} strokeWidth={3} />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Tag Input */}
            <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
              <input
                type="text"
                className="stationery-input"
                placeholder="Add custom tag..."
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomTag(e);
                  }
                }}
                style={{ padding: '6px 10px', fontSize: '13px', flex: 1, minWidth: 0 }}
              />
              <button
                type="button"
                className="btn-stamp btn-stamp-sm"
                onClick={handleAddCustomTag}
              >
                <Plus size={13} />
                <span>Tag</span>
              </button>
            </div>
          </div>

          {/* Handwritten Notes Field */}
          <div className="form-group">
            <label className="form-label">
              <span>Handwritten Ledger Notes (Optional)</span>
            </label>
            <textarea
              rows={2}
              className="stationery-textarea handwriting"
              placeholder="Personal remarks, preferred dispatch hours..."
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              style={{ fontSize: '16px', resize: 'vertical' }}
            />
          </div>

          {/* Favorite Toggle Checkbox */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              backgroundColor: 'var(--bg-parchment-base)',
              borderRadius: '6px',
              marginBottom: '18px',
              border: '1px solid rgba(59, 42, 30, 0.15)',
              cursor: 'pointer',
            }}
            onClick={() => handleChange('isFavorite', !formData.isFavorite)}
          >
            <input
              type="checkbox"
              id="isFavoriteCheck"
              checked={formData.isFavorite}
              onChange={(e) => handleChange('isFavorite', e.target.checked)}
              style={{ accentColor: 'var(--accent-mustard-dark)', width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="isFavoriteCheck" style={{ fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Star size={15} fill={formData.isFavorite ? 'var(--accent-mustard)' : 'none'} color="var(--accent-brass)" />
              <span>Starred Favorite Contact</span>
            </label>
          </div>

          {/* Footer Submit Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '8px',
              borderTop: '2px dashed rgba(59, 42, 30, 0.15)',
              paddingTop: '16px',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              className="btn-stamp"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-stamp btn-stamp-primary"
              disabled={isSubmitting}
            >
              <StampIcon size={15} />
              <span>{isSubmitting ? 'Inscribing...' : isEditing ? 'Save Revisions' : 'Stamp & Save'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
