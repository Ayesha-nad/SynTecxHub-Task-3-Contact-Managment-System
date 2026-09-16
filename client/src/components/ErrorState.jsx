import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorState = ({ message, onRetry }) => {
  return (
    <div
      style={{
        maxWidth: '520px',
        margin: '40px auto',
        padding: '32px',
        backgroundColor: '#fff7f2',
        border: '2px dashed var(--accent-coral)',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(217, 119, 87, 0.15)',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      {/* Decorative Washi Tape */}
      <div className="washi-tape washi-tape-coral" />

      <div
        style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-coral-soft)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        <AlertCircle size={28} color="var(--accent-coral-dark)" />
      </div>

      <h3 style={{ fontSize: '20px', color: 'var(--accent-coral-dark)', marginBottom: '8px' }}>
        Ink Spill on the Ledger
      </h3>

      <p style={{ color: 'var(--text-espresso)', fontSize: '14px', marginBottom: '20px' }}>
        {message || 'Could not communicate with the Rolodex backend server. Please verify the server is running on port 5000.'}
      </p>

      <button className="btn-stamp btn-stamp-coral" onClick={onRetry}>
        <RefreshCw size={14} />
        <span>Try Reloading Rolodex</span>
      </button>
    </div>
  );
};
