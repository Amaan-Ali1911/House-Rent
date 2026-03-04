import React, { useEffect } from "react";

const Toast = ({ type, message, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, []);

  const colors = {
    success: { bg: '#F0FDF4', border: '#86EFAC', text: '#15803D', icon: '✓' },
    error: { bg: '#FEF2F2', border: '#FCA5A5', text: '#B91C1C', icon: '✕' },
  };
  const c = colors[type] || colors.error;

  return (
    <div style={{
      position: 'fixed', top: '80px', right: '1.5rem', zIndex: 9999,
      background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: '10px',
      padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
      boxShadow: '0 8px 30px rgba(0,0,0,0.1)', maxWidth: '360px',
      fontFamily: "'DM Sans', sans-serif", animation: 'slideDown 0.3s ease',
      color: c.text
    }}>
      <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{c.icon}</span>
      <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{message}</span>
      <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: c.text, opacity: 0.6, fontSize: '1rem', paddingLeft: '0.5rem' }}>✕</button>
    </div>
  );
};

export default Toast;
