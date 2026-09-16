import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Star,
  Edit3,
  Trash2,
  BookOpen,
} from 'lucide-react';
import { getInitials, getCleanPhone } from '../utils/formatters';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const RolodexView = ({
  contacts = [],
  onViewDetails,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeLetter, setActiveLetter] = useState('ALL');

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Group contacts by first letter for quick tab badges
  const alphabetMap = useMemo(() => {
    const map = {};
    ALPHABET.forEach((char) => {
      map[char] = 0;
    });
    contacts.forEach((c) => {
      if (c.name) {
        const firstLetter = c.name.trim()[0].toUpperCase();
        if (map[firstLetter] !== undefined) {
          map[firstLetter]++;
        }
      }
    });
    return map;
  }, [contacts]);

  // Adjust index if contacts change or shrink
  useEffect(() => {
    if (currentIndex >= contacts.length) {
      setCurrentIndex(Math.max(0, contacts.length - 1));
    }
  }, [contacts.length, currentIndex]);

  // Sync active letter with current card
  useEffect(() => {
    if (contacts.length > 0 && contacts[currentIndex]) {
      const letter = contacts[currentIndex].name?.trim()[0]?.toUpperCase() || 'ALL';
      setActiveLetter(letter);
    }
  }, [contacts, currentIndex]);

  // Jump directly to first contact with specified letter
  const jumpToLetter = (letter) => {
    setActiveLetter(letter);
    const targetIdx = contacts.findIndex(
      (c) => c.name && c.name.trim()[0].toUpperCase() === letter
    );
    if (targetIdx !== -1) {
      setCurrentIndex(targetIdx);
    }
  };

  const nextCard = () => {
    if (contacts.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % contacts.length);
  };

  const prevCard = () => {
    if (contacts.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + contacts.length) % contacts.length);
  };

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextCard();
    } else if (isRightSwipe) {
      prevCard();
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextCard();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        prevCard();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const currentContact = contacts[currentIndex];

  if (contacts.length === 0) {
    return null;
  }

  return (
    <div className="rolodex-container">
      <div className="rolodex-machine">
        {/* Alphabetical Index Tabs on Top */}
        <div className="alphabet-tabs-bar" role="tablist">
          {ALPHABET.map((char) => {
            const count = alphabetMap[char] || 0;
            const isCurrent = activeLetter === char;
            const hasCards = count > 0;

            return (
              <button
                key={char}
                className={`alpha-tab ${isCurrent ? 'active' : ''} ${
                  hasCards ? 'has-contacts' : ''
                }`}
                onClick={() => jumpToLetter(char)}
                disabled={!hasCards}
                title={`${char} — ${count} contact${count === 1 ? '' : 's'}`}
                style={{
                  opacity: hasCards ? 1 : 0.4,
                  cursor: hasCards ? 'pointer' : 'default',
                }}
              >
                {char}
              </button>
            );
          })}
        </div>

        {/* Card Stage / Featured Card View with Touch Swipe */}
        <div
          className="rolodex-card-stage"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {currentContact && (
            <div className="rolodex-featured-card ruled-paper">
              {/* Washi Tape Accent */}
              <div className="washi-tape washi-tape-mustard" />

              {/* Top Header of Card */}
              <div className="rolodex-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                  <div
                    className="wax-seal wax-seal-lg"
                    style={{ backgroundColor: currentContact.avatarColor || '#7a8c6f' }}
                  >
                    {getInitials(currentContact.name)}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h2 style={{ fontSize: '20px', margin: 0, wordBreak: 'break-word' }}>
                      {currentContact.name}
                    </h2>
                    {(currentContact.jobTitle || currentContact.company) && (
                      <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px', wordBreak: 'break-word' }}>
                        {currentContact.jobTitle}
                        {currentContact.jobTitle && currentContact.company ? ' • ' : ''}
                        <strong>{currentContact.company}</strong>
                      </p>
                    )}
                  </div>
                </div>

                {/* Star Pin */}
                <button
                  className={`star-pin ${currentContact.isFavorite ? 'active' : ''}`}
                  onClick={(e) => onToggleFavorite(currentContact._id, e)}
                  title={currentContact.isFavorite ? 'Unpin favorite' : 'Pin to favorites'}
                >
                  <Star size={22} fill={currentContact.isFavorite ? 'var(--accent-mustard)' : 'none'} />
                </button>
              </div>

              {/* Body Details */}
              <div className="rolodex-card-body">
                {/* Phone */}
                {currentContact.phone && (
                  <div className="contact-info-row">
                    <Phone size={16} className="contact-info-icon" />
                    <div style={{ minWidth: 0 }}>
                      <div className="contact-info-label">Telephone</div>
                      <div className="contact-info-val">
                        <a href={`tel:${getCleanPhone(currentContact.phone)}`}>
                          {currentContact.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Email */}
                {currentContact.email && (
                  <div className="contact-info-row">
                    <Mail size={16} className="contact-info-icon" />
                    <div style={{ minWidth: 0 }}>
                      <div className="contact-info-label">Dispatch / Email</div>
                      <div className="contact-info-val">
                        <a href={`mailto:${currentContact.email}`}>
                          {currentContact.email}
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Address */}
                {currentContact.address && (
                  <div className="contact-info-row" style={{ gridColumn: '1 / -1' }}>
                    <MapPin size={16} className="contact-info-icon" />
                    <div style={{ minWidth: 0 }}>
                      <div className="contact-info-label">Physical Address</div>
                      <div className="contact-info-val" style={{ fontSize: '13px' }}>
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(currentContact.address)}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ textDecoration: 'underline' }}
                        >
                          {currentContact.address}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Notes Snippet */}
              {currentContact.notes && (
                <div className="rolodex-card-notes">
                  <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '3px' }}>
                    Handwritten Ledger Note:
                  </div>
                  <div className="handwriting" style={{ fontSize: '16px' }}>
                    "{currentContact.notes}"
                  </div>
                </div>
              )}

              {/* Tags and Action Footer */}
              <div className="rolodex-card-footer">
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  {(currentContact.tags || []).map((t, idx) => (
                    <span key={idx} className={`tag-pill tag-${t}`}>
                      #{t}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    className="btn-stamp btn-stamp-sm"
                    onClick={() => onViewDetails(currentContact)}
                    title="Open full paper dossier"
                  >
                    <BookOpen size={13} />
                    <span>Dossier</span>
                  </button>

                  <button
                    className="icon-action-btn"
                    onClick={() => onEdit(currentContact)}
                    title="Edit contact ledger"
                  >
                    <Edit3 size={15} />
                  </button>

                  <button
                    className="icon-action-btn btn-delete"
                    onClick={() => onDelete(currentContact)}
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
          )}
        </div>

        {/* Carousel Navigation Bottom Controls */}
        <div className="rolodex-navigation-controls">
          <button className="btn-stamp btn-stamp-sm" onClick={prevCard} title="Previous card">
            <ChevronLeft size={15} />
            <span>Prev</span>
          </button>

          <div className="card-counter-badge">
            {currentIndex + 1} / {contacts.length}
          </div>

          <button className="btn-stamp btn-stamp-sm" onClick={nextCard} title="Next card">
            <span>Next</span>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
