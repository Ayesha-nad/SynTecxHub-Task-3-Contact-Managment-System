import React from 'react';

/**
 * Custom SVG icons tailored with vintage stationery & tactile feel
 */

export const RolodexIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="16" rx="2" fill="#ebdcc3" stroke="#3b2a1e" strokeWidth="2"/>
    <circle cx="7" cy="12" r="1.5" fill="#3b2a1e"/>
    <path d="M11 9h8M11 12h8M11 15h5" stroke="#3b2a1e" strokeWidth="1.8"/>
    <path d="M8 20v2M16 20v2M2 8h2M20 8h2" stroke="#3b2a1e" strokeWidth="2"/>
  </svg>
);

export const QuillIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 2c-3 1-8 6-9 11l-3 3 1 1 3-3c5-1 10-6 11-9z"/>
    <path d="M7 17l-4 4 1 1 4-4"/>
    <path d="M14 8l2 2"/>
  </svg>
);

export const StampIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 22h14M5 18h14v4H5zM8 18v-5a4 4 0 0 1 8 0v5M10 6a2 2 0 1 1 4 0v3h-4z"/>
  </svg>
);

export const RotaryDialIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9"/>
    <circle cx="12" cy="12" r="3"/>
    <circle cx="12" cy="6" r="1" fill="currentColor"/>
    <circle cx="17.2" cy="9" r="1" fill="currentColor"/>
    <circle cx="17.2" cy="15" r="1" fill="currentColor"/>
    <circle cx="12" cy="18" r="1" fill="currentColor"/>
    <circle cx="6.8" cy="15" r="1" fill="currentColor"/>
    <circle cx="6.8" cy="9" r="1" fill="currentColor"/>
  </svg>
);

export const TearPageIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <path d="M4 14l3-2 3 2 3-2 3 2 4-3" strokeDasharray="2 2"/>
  </svg>
);
