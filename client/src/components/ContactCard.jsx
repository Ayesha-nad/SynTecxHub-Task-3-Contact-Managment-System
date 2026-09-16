import React from 'react';
import { Mail, Phone, MapPin, Star, Edit3, Trash2, ExternalLink } from 'lucide-react';
import { getInitials, getCleanPhone } from '../utils/formatters';

export const ContactCard = ({
  contact,
  onViewDetails,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const {
    _id,
    name,
    email,
    phone,
    company,
    jobTitle,
    address,
    tags = [],
    isFavorite,
    avatarColor = '#7a8c6f',
  } = contact;

  return (
    <div
      className="index-card ruled-paper-subtle"
      onClick={() => onViewDetails(contact)}
      title={`Open ${name}'s ledger dossier`}
    >
      {/* Decorative Washi Tape Corner */}
      <div className="washi-tape-corner" />

      {/* Top Row: Wax Seal Avatar & Star Pin */}
      <div className="card-top-row">
        <div className="card-person-info">
          <div
            className="wax-seal"
            style={{ backgroundColor: avatarColor }}
            title={`Wax seal of ${name}`}
          >
            {getInitials(name)}
          </div>

          <div className="card-name-title">
            <h3>{name}</h3>
            {(jobTitle || company) && (
              <p>
                {jobTitle}
                {jobTitle && company ? ' • ' : ''}
                {company}
              </p>
            )}
          </div>
        </div>

        {/* Favorite Brass Pin */}
        <button
          className={`star-pin ${isFavorite ? 'active' : ''}`}
          onClick={(e) => onToggleFavorite(_id, e)}
          title={isFavorite ? 'Unpin favorite' : 'Pin to favorites'}
        >
          <Star size={18} fill={isFavorite ? 'var(--accent-mustard)' : 'none'} />
        </button>
      </div>

      {/* Details Stack */}
      <div className="card-details-stack">
        {phone && (
          <div className="card-detail-item" onClick={(e) => e.stopPropagation()}>
            <Phone size={13} color="var(--accent-sage-dark)" style={{ flexShrink: 0 }} />
            <a href={`tel:${getCleanPhone(phone)}`}>{phone}</a>
          </div>
        )}

        {email && (
          <div className="card-detail-item" onClick={(e) => e.stopPropagation()}>
            <Mail size={13} color="var(--accent-navy)" style={{ flexShrink: 0 }} />
            <a href={`mailto:${email}`}>{email}</a>
          </div>
        )}

        {address && (
          <div className="card-detail-item">
            <MapPin size={13} color="var(--accent-coral)" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{address}</span>
          </div>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="card-tags-row">
            {tags.map((t, idx) => (
              <span key={idx} className={`tag-pill tag-${t}`}>
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="card-actions-bar" onClick={(e) => e.stopPropagation()}>
        <button
          className="btn-stamp btn-stamp-sm"
          onClick={() => onViewDetails(contact)}
          title="Open complete paper dossier"
        >
          <ExternalLink size={12} />
          <span>Dossier</span>
        </button>

        <div className="card-btn-group">
          <button
            className="icon-action-btn"
            onClick={() => onEdit(contact)}
            title="Edit ledger entry"
          >
            <Edit3 size={15} />
          </button>

          <button
            className="icon-action-btn btn-delete"
            onClick={() => onDelete(contact)}
            title="Tear out page from Rolodex"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Bottom Rolodex Slot Notches */}
      <div className="rolodex-slots">
        <div className="rolodex-slot" />
        <div className="rolodex-slot" />
      </div>
    </div>
  );
};
