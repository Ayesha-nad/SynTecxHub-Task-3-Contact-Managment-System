import React from 'react';
import { Search, X, Star, Tag } from 'lucide-react';

export const SearchBar = ({
  searchQuery,
  setSearchQuery,
  selectedTag,
  setSelectedTag,
  availableTags = [],
  sortOption,
  setSortOption,
  favoriteOnly,
  setFavoriteOnly,
}) => {
  return (
    <section className="search-filter-section">
      <div className="search-filter-card">
        {/* Search Row: Search Input + Subrow with Favorites & Sort */}
        <div className="search-row">
          {/* Adhesive Sticker Search Bar */}
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-sticker"
              placeholder="Search Rolodex by name, email, phone, company, or note..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                title="Clear search query"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Sub-row for Favorites and Sort on mobile */}
          <div className="search-controls-subrow">
            {/* Favorite Toggle Button */}
            <button
              className={`btn-stamp btn-stamp-sm ${favoriteOnly ? 'btn-stamp-mustard' : ''}`}
              onClick={() => setFavoriteOnly(!favoriteOnly)}
              title={favoriteOnly ? 'Show all contacts' : 'Show only starred favorites'}
            >
              <Star
                size={14}
                fill={favoriteOnly ? 'var(--text-dark)' : 'none'}
                color={favoriteOnly ? 'var(--text-dark)' : 'var(--accent-brass)'}
              />
              <span>Favorites</span>
            </button>

            {/* Sort Dropdown */}
            <div className="sort-select-wrapper">
              <label htmlFor="sort-select" style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>
                Sort:
              </label>
              <select
                id="sort-select"
                className="sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="name-asc">Name (A → Z)</option>
                <option value="name-desc">Name (Z → A)</option>
                <option value="newest">Recently Added</option>
                <option value="oldest">Earliest Added</option>
                <option value="company">Company</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bottom Row: Tag Filter Ribbon */}
        <div className="tag-filter-ribbon">
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '700', paddingRight: '2px', flexShrink: 0 }}>
            <Tag size={12} />
            <span>Shelves:</span>
          </div>

          <button
            className={`tag-filter-btn ${selectedTag === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedTag('All')}
          >
            <span>All Contacts</span>
          </button>

          {availableTags.map((tag) => (
            <button
              key={tag.name}
              className={`tag-filter-btn ${selectedTag === tag.name ? 'active' : ''}`}
              onClick={() => setSelectedTag(tag.name)}
            >
              <span>{tag.name}</span>
              <span className="tag-count">{tag.count}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
