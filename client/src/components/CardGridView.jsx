import React from 'react';
import { ContactCard } from './ContactCard';

export const CardGridView = ({
  contacts = [],
  onViewDetails,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  return (
    <div className="grid-container">
      <div className="cards-grid">
        {contacts.map((contact) => (
          <ContactCard
            key={contact._id}
            contact={contact}
            onViewDetails={onViewDetails}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};
