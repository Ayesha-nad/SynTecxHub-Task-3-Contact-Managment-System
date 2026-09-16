import React from 'react';
import { useToast } from './hooks/useToast';
import { useContacts } from './hooks/useContacts';

// Components
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { RolodexView } from './components/RolodexView';
import { CardGridView } from './components/CardGridView';
import { ContactDetailModal } from './components/ContactDetailModal';
import { ContactFormModal } from './components/ContactFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ToastContainer } from './components/ToastContainer';
import { SkeletonCard } from './components/SkeletonCard';
import { EmptyState } from './components/EmptyState';
import { ErrorState } from './components/ErrorState';

export function App() {
  const { toasts, showToast, removeToast } = useToast();

  const {
    contacts,
    filteredContacts,
    availableTags,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    favoriteOnly,
    setFavoriteOnly,
    sortOption,
    setSortOption,
    viewMode,
    setViewMode,
    isAddEditOpen,
    setIsAddEditOpen,
    editingContact,
    setEditingContact,
    viewingContact,
    setViewingContact,
    isDeleteOpen,
    setIsDeleteOpen,
    contactToDelete,
    setContactToDelete,
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
    toggleFavorite,
    seedContacts,
  } = useContacts(showToast);

  // Computed favorites count
  const favoritesCount = contacts.filter((c) => c.isFavorite).length;

  // Handler for opening the Add Contact modal
  const handleOpenAdd = () => {
    setEditingContact(null);
    setIsAddEditOpen(true);
  };

  // Handler for opening the Edit Contact modal
  const handleOpenEdit = (contact) => {
    setEditingContact(contact);
    setIsAddEditOpen(true);
  };

  // Handler for opening the Delete confirmation modal
  const handleOpenDelete = (contact) => {
    setContactToDelete(contact);
    setIsDeleteOpen(true);
  };

  // Submit handler for add/edit form
  const handleFormSubmit = async (formData) => {
    if (editingContact && editingContact._id) {
      return await updateContact(editingContact._id, formData);
    } else {
      return await createContact(formData);
    }
  };

  // Reset search and filters
  const handleResetSearch = () => {
    setSearchQuery('');
    setSelectedTag('All');
    setFavoriteOnly(false);
  };

  const isSearchingOrFiltered = Boolean(
    searchQuery.trim() || selectedTag !== 'All' || favoriteOnly
  );

  return (
    <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Desk Top Navigation Header */}
      <Header
        contactsCount={contacts.length}
        favoritesCount={favoritesCount}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenAddModal={handleOpenAdd}
        onSeedContacts={() => seedContacts(true)}
        contacts={contacts}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {/* Search & Tag Ribbon */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          availableTags={availableTags}
          sortOption={sortOption}
          setSortOption={setSortOption}
          favoriteOnly={favoriteOnly}
          setFavoriteOnly={setFavoriteOnly}
        />

        {/* Content Views */}
        {loading ? (
          <div className="grid-container">
            <div className="cards-grid">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={fetchContacts} />
        ) : contacts.length === 0 ? (
          <EmptyState
            isSearching={false}
            onOpenAddModal={handleOpenAdd}
            onSeedContacts={() => seedContacts(false)}
          />
        ) : filteredContacts.length === 0 ? (
          <EmptyState
            isSearching={true}
            onResetSearch={handleResetSearch}
          />
        ) : viewMode === 'rolodex' ? (
          <RolodexView
            contacts={filteredContacts}
            onViewDetails={(contact) => setViewingContact(contact)}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
            onToggleFavorite={toggleFavorite}
            onSeedContacts={() => seedContacts(true)}
          />
        ) : (
          <CardGridView
            contacts={filteredContacts}
            onViewDetails={(contact) => setViewingContact(contact)}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </main>

      {/* Tactile Footer */}
      <footer
        style={{
          textAlign: 'center',
          padding: '24px 20px',
          borderTop: '2px dashed rgba(59, 42, 30, 0.15)',
          color: 'var(--text-muted)',
          fontSize: '13px',
          backgroundColor: 'var(--bg-parchment-base)',
        }}
      >
        <p style={{ margin: 0, fontFamily: 'var(--font-serif-heading)', fontSize: '15px' }}>
          The Analog Rolodex & Address Book • Handcrafted for enduring connection.
        </p>
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-faded)' }}>
          Powered by React, Express, and MongoDB.
        </p>
      </footer>

      {/* Contact Detail Dossier Modal */}
      {viewingContact && (
        <ContactDetailModal
          contact={viewingContact}
          onClose={() => setViewingContact(null)}
          onEdit={(c) => {
            setViewingContact(null);
            handleOpenEdit(c);
          }}
          onDelete={(c) => {
            setViewingContact(null);
            handleOpenDelete(c);
          }}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {/* Add / Edit Contact Form Modal */}
      <ContactFormModal
        isOpen={isAddEditOpen}
        onClose={() => {
          setIsAddEditOpen(false);
          setEditingContact(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingContact}
      />

      {/* Tear Out Page Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        contact={contactToDelete}
        onClose={() => {
          setIsDeleteOpen(false);
          setContactToDelete(null);
        }}
        onConfirm={deleteContact}
      />
    </div>
  );
}

export default App;
