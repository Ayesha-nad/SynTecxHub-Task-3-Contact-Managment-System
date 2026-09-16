import React from 'react';
import { TearPageIcon } from './Icons';
import { getInitials } from '../utils/formatters';

export const DeleteConfirmModal = ({
  isOpen,
  contact,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !contact) return null;

  const { _id, name, email, avatarColor = '#7a8c6f' } = contact;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-sheet torn-paper-modal"
        style={{ maxWidth: '440px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Torn Perforation Warning */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-coral-soft)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed var(--accent-coral)',
              marginBottom: '10px',
            }}
          >
            <TearPageIcon size={24} className="text-coral" />
          </div>

          <h2 style={{ fontSize: '19px', color: 'var(--accent-coral-dark)', margin: '0 0 4px 0' }}>
            Tear Out This Page?
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
            This will permanently remove this record from your Rolodex.
          </p>
        </div>

        {/* Contact Snippet Card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 14px',
            backgroundColor: 'var(--bg-parchment-base)',
            border: '1.5px solid rgba(59, 42, 30, 0.2)',
            borderRadius: '6px',
            marginBottom: '18px',
          }}
        >
          <div
            className="wax-seal"
            style={{ backgroundColor: avatarColor }}
          >
            {getInitials(name)}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h4 style={{ margin: 0, fontSize: '15px', wordBreak: 'break-word' }}>{name}</h4>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', wordBreak: 'break-all' }}>{email}</p>
          </div>
        </div>

        {/* Perforated Divider */}
        <div
          style={{
            borderBottom: '2px dashed rgba(217, 119, 87, 0.4)',
            marginBottom: '18px',
            position: 'relative',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '-10px',
              right: '6px',
              backgroundColor: 'var(--bg-card)',
              padding: '0 4px',
              fontSize: '10px',
              fontFamily: 'var(--font-typewriter)',
              color: 'var(--accent-coral)',
            }}
          >
            ✂ tear along perforation
          </span>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          <button type="button" className="btn-stamp" onClick={onClose}>
            Keep in Rolodex
          </button>

          <button
            type="button"
            className="btn-stamp btn-stamp-coral"
            onClick={() => onConfirm(_id)}
          >
            <TearPageIcon size={14} />
            <span>Tear & Destroy</span>
          </button>
        </div>
      </div>
    </div>
  );
};
