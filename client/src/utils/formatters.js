/**
 * Utility formatters for contact data
 */

// Generate initials from contact name
export const getInitials = (name = '') => {
  if (!name.trim()) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Format date into vintage stationery style e.g. "Sep 16, 1954" or "September 16, 2026"
export const formatVintageDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Format current date for header stamp e.g. "Wednesday, September 16, 2026"
export const getCurrentDateFormatted = () => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

// Clean phone number for tel: links
export const getCleanPhone = (phone = '') => {
  return phone.replace(/[^\d+]/g, '');
};
