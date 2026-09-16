import React from 'react';
import { Check, AlertCircle, X, Info } from 'lucide-react';

export const ToastContainer = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '12px',
        right: '12px',
        left: '12px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '8px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, onDismiss }) => {
  const getBadgeStyle = () => {
    switch (toast.type) {
      case 'coral':
      case 'danger':
        return {
          bg: '#fae4dc',
          border: 'var(--accent-coral)',
          text: 'var(--accent-coral-dark)',
          icon: <AlertCircle size={16} color="var(--accent-coral)" />,
        };
      case 'error':
        return {
          bg: '#fdf0ed',
          border: '#be5635',
          text: '#be5635',
          icon: <AlertCircle size={16} color="#be5635" />,
        };
      case 'info':
        return {
          bg: 'var(--accent-navy-soft)',
          border: 'var(--accent-navy)',
          text: 'var(--accent-navy)',
          icon: <Info size={16} color="var(--accent-navy)" />,
        };
      case 'success':
      default:
        return {
          bg: 'var(--accent-sage-soft)',
          border: 'var(--accent-sage-dark)',
          text: '#2d3b25',
          icon: <Check size={16} color="var(--accent-sage-dark)" strokeWidth={3} />,
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <div
      className="stamped-toast"
      style={{
        pointerEvents: 'auto',
        backgroundColor: style.bg,
        borderColor: style.border,
        color: style.text,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        maxWidth: '400px',
        width: 'auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
        <div style={{ flexShrink: 0 }}>{style.icon}</div>
        <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', lineHeight: 1.3, wordBreak: 'break-word' }}>
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: style.text,
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.7,
          flexShrink: 0,
        }}
        title="Dismiss note"
      >
        <X size={15} />
      </button>
    </div>
  );
};
