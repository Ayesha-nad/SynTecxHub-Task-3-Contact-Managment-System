import React, { useState } from 'react';
import { Plus, Download, Star, Users, LayoutGrid, RotateCw, FileSpreadsheet, Contact as VCardIcon } from 'lucide-react';
import { RolodexIcon, RotaryDialIcon } from './Icons';
import { getCurrentDateFormatted } from '../utils/formatters';
import { exportToVCard, exportToCSV } from '../utils/exportUtils';

export const Header = ({
  contactsCount = 0,
  favoritesCount = 0,
  viewMode = 'rolodex',
  setViewMode,
  onOpenAddModal,
  onSeedContacts,
  contacts = [],
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExportCSV = () => {
    setShowExportMenu(false);
    exportToCSV(contacts);
  };

  const handleExportVCard = () => {
    setShowExportMenu(false);
    exportToVCard(contacts);
  };

  return (
    <header className="desk-header">
      <div className="header-container">
        {/* Brand Plaque */}
        <div className="header-brand">
          <div className="brass-plaque">
            <RolodexIcon size={26} />
            <div>
              <h1>The Analog Rolodex</h1>
            </div>
          </div>
          <span className="date-stamp">{getCurrentDateFormatted()}</span>
        </div>

        {/* Stats and Controls */}
        <div className="header-stats">
          <div className="stat-tag" title="Total contacts in your Rolodex">
            <Users size={14} color="var(--text-espresso)" />
            <span>Filing: <strong>{contactsCount}</strong></span>
          </div>

          <div className="stat-tag" title="Pinned favorite contacts">
            <Star size={14} fill="var(--accent-mustard)" color="var(--accent-mustard-dark)" />
            <span>Favorites: <strong>{favoritesCount}</strong></span>
          </div>
        </div>

        {/* Actions & View Switcher */}
        <div className="header-actions">
          {/* View Mode Toggle */}
          <div className="view-switcher" role="group" aria-label="View Switcher">
            <button
              className={`view-btn ${viewMode === 'rolodex' ? 'active' : ''}`}
              onClick={() => setViewMode('rolodex')}
              title="Rolodex 3D Rotary Carousel View"
            >
              <RotaryDialIcon size={16} />
              <span>Rolodex</span>
            </button>
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Desk Index Card Grid View"
            >
              <LayoutGrid size={16} />
              <span>Desk Grid</span>
            </button>
          </div>

          {/* Export Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              className="btn-stamp btn-stamp-sm"
              onClick={() => setShowExportMenu(!showExportMenu)}
              title="Export address book to vCard or CSV"
            >
              <Download size={14} />
              <span>Export</span>
            </button>

            {showExportMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  background: 'var(--bg-parchment-light)',
                  border: '2px solid var(--text-espresso)',
                  borderRadius: '6px',
                  boxShadow: '3px 3px 0px var(--text-espresso)',
                  padding: '6px',
                  zIndex: 100,
                  minWidth: '170px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <button
                  onClick={handleExportVCard}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: 'var(--text-espresso)',
                    borderRadius: '4px',
                    width: '100%',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-parchment-dark)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <VCardIcon size={16} color="var(--accent-sage-dark)" />
                  <span>Export vCard (.vcf)</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: 'var(--text-espresso)',
                    borderRadius: '4px',
                    width: '100%',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-parchment-dark)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <FileSpreadsheet size={16} color="var(--accent-coral)" />
                  <span>Export CSV (.csv)</span>
                </button>
              </div>
            )}
          </div>

          {/* Add Contact Button */}
          <button
            className="btn-stamp btn-stamp-primary"
            onClick={onOpenAddModal}
            title="Inscribe a new contact"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Inscribe Contact</span>
          </button>
        </div>
      </div>
    </header>
  );
};
