import React from 'react';
import { RolodexIcon, QuillIcon } from './Icons';
import { Sparkles, RefreshCw, Plus, Search } from 'lucide-react';

export const EmptyState = ({
  isSearching = false,
  onResetSearch,
  onOpenAddModal,
  onSeedContacts,
}) => {
  if (isSearching) {
    return (
      <div className="empty-rolodex-box">
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-parchment-dark)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <Search size={32} color="var(--text-muted)" />
        </div>

        <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>No Ledger Entries Found</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '380px', margin: '0 auto 20px' }}>
          No contacts in your Rolodex match the current search query or active shelf filters.
        </p>

        <button className="btn-stamp" onClick={onResetSearch}>
          <RefreshCw size={14} />
          <span>Clear Search & Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="empty-rolodex-box">
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-mustard-soft)',
          border: '2px dashed var(--accent-mustard-dark)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '18px',
        }}
      >
        <RolodexIcon size={38} />
      </div>

      <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Your Rolodex is Blank</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '420px', margin: '0 auto 24px' }}>
        Begin crafting your tactile address book by adding your first contact, or populate it with sample vintage records.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <button className="btn-stamp btn-stamp-primary" onClick={onOpenAddModal}>
          <Plus size={16} />
          <span>Inscribe First Contact</span>
        </button>

        <button className="btn-stamp btn-stamp-mustard" onClick={onSeedContacts}>
          <Sparkles size={16} />
          <span>Load Vintage Rolodex</span>
        </button>
      </div>
    </div>
  );
};
