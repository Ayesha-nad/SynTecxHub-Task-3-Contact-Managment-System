import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="skeleton-card ruled-paper-subtle">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div className="skeleton-circle" />
        <div style={{ flex: 1 }}>
          <div className="skeleton-line" style={{ width: '60%', height: '18px' }} />
          <div className="skeleton-line" style={{ width: '40%', height: '12px' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <div className="skeleton-line" style={{ width: '75%' }} />
        <div className="skeleton-line" style={{ width: '85%' }} />
        <div className="skeleton-line" style={{ width: '65%' }} />
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
        <div className="skeleton-line" style={{ width: '50px', height: '22px', borderRadius: '12px' }} />
        <div className="skeleton-line" style={{ width: '60px', height: '22px', borderRadius: '12px' }} />
      </div>
    </div>
  );
};
