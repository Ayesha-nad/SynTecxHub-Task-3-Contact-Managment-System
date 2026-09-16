import React, { useState } from 'react';
import {
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Tag,
  Copy,
  Check,
  Download,
  Edit3,
  Trash2,
  ExternalLink,
  Star,
} from 'lucide-react';
import { getInitials, formatVintageDate, getCleanPhone } from '../utils/formatters';
import { exportToVCard } from '../utils/exportUtils';

export const ContactDetailModal = ({
  contact,
  onClose,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const [copiedField, setCopiedField] = useState(null);

  if (!contact) return null;

  const {
    _id,
    name,
    email,
    phone,
    company,
    jobTitle,
    address,
    tags = [],
    notes,
    isFavorite,
    avatarColor = '#7a8c6f',
    createdAt,
  } = contact;

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleExportSingle = () => {
    exportToVCard(contact);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-sheet stitched-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Perforated Tag */}
        <div className="washi-tape washi-tape-sage" />

        {/* Header Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            borderBottom: '2px double rgba(59, 42, 30, 0.2)',
            paddingBottom: '14px',
            marginBottom: '18px',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
            <div
              className="wax-seal wax-seal-lg"
              style={{ backgroundColor: avatarColor }}
            >
              {getInitials(name)}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '20px', margin: 0, wordBreak: 'break-word' }}>{name}</h2>
                <button
                  className={`star-pin ${isFavorite ? 'active' : ''}`}
                  onClick={() => onToggleFavorite(_id)}
                  title={isFavorite ? 'Unpin favorite' : 'Pin to favorites'}
                >
                  <Star size={20} fill={isFavorite ? 'var(--accent-mustard)' : 'none'} />
                </button>
              </div>
              {(jobTitle || company) && (
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px', wordBreak: 'break-word' }}>
                  {jobTitle}
                  {jobTitle && company ? ' • ' : ''}
                  <strong>{company}</strong>
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="icon-action-btn"
            style={{ padding: '6px' }}
            title="Close dossier"
          >
            <X size={18} />
          </button>
        </div>

        {/* Dossier Content Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Telephone */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              backgroundColor: 'var(--bg-parchment-light)',
              borderRadius: '6px',
              border: '1px solid rgba(59, 42, 30, 0.12)',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-sage-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Phone size={15} color="var(--accent-sage-dark)" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Telephone
                </div>
                <a
                  href={`tel:${getCleanPhone(phone)}`}
                  style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-espresso)' }}
                >
                  {phone}
                </a>
              </div>
            </div>

            <button
              className="icon-action-btn"
              onClick={() => handleCopy(phone, 'phone')}
              title="Copy phone"
            >
              {copiedField === 'phone' ? <Check size={14} color="var(--accent-sage-dark)" /> : <Copy size={14} />}
            </button>
          </div>

          {/* Email */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              backgroundColor: 'var(--bg-parchment-light)',
              borderRadius: '6px',
              border: '1px solid rgba(59, 42, 30, 0.12)',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-navy-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Mail size={15} color="var(--accent-navy)" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Dispatch / Email
                </div>
                <a
                  href={`mailto:${email}`}
                  style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-espresso)' }}
                >
                  {email}
                </a>
              </div>
            </div>

            <button
              className="icon-action-btn"
              onClick={() => handleCopy(email, 'email')}
              title="Copy email"
            >
              {copiedField === 'email' ? <Check size={14} color="var(--accent-sage-dark)" /> : <Copy size={14} />}
            </button>
          </div>

          {/* Address */}
          {address && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                backgroundColor: 'var(--bg-parchment-light)',
                borderRadius: '6px',
                border: '1px solid rgba(59, 42, 30, 0.12)',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-coral-soft)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <MapPin size={15} color="var(--accent-coral)" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Physical Address
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>{address}</div>
                </div>
              </div>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noreferrer"
                className="icon-action-btn"
                title="Google Maps"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          )}

          {/* Notes Sheet */}
          {notes && (
            <div
              style={{
                backgroundColor: '#fffbe8',
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 23px, rgba(122, 140, 111, 0.2) 24px)',
                backgroundSize: '100% 24px',
                border: '1px solid #ebd9a4',
                borderRadius: '6px',
                padding: '12px 14px',
              }}
            >
              <div style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: '#91712a', marginBottom: '6px' }}>
                Handwritten Dossier Note:
              </div>
              <p className="handwriting" style={{ margin: 0, fontSize: '16px', color: '#312316' }}>
                "{notes}"
              </p>
            </div>
          )}

          {/* Tags & Metadata */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px',
              paddingTop: '4px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
              <Tag size={13} color="var(--text-muted)" />
              {tags.map((t, idx) => (
                <span key={idx} className={`tag-pill tag-${t}`}>
                  #{t}
                </span>
              ))}
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-faded)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={12} />
              <span>Inscribed: {formatVintageDate(createdAt)}</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '16px',
              borderTop: '2px dashed rgba(59, 42, 30, 0.15)',
              marginTop: '6px',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <button
              className="btn-stamp btn-stamp-sm"
              onClick={handleExportSingle}
              title="Download contact vCard"
            >
              <Download size={13} />
              <span>vCard</span>
            </button>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                className="btn-stamp btn-stamp-sm"
                onClick={() => {
                  onClose();
                  onEdit(contact);
                }}
              >
                <Edit3 size={13} />
                <span>Edit</span>
              </button>

              <button
                className="btn-stamp btn-stamp-sm btn-stamp-coral"
                onClick={() => {
                  onClose();
                  onDelete(contact);
                }}
              >
                <Trash2 size={13} />
                <span>Tear Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
