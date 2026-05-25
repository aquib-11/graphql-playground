export const c = {
  primary:       '#6c63ff',
  danger:        '#dc2626',
  dangerLight:   '#fef2f2',
  dangerBorder:  '#fca5a5',
  success:       '#16a34a',
  successLight:  '#f0fdf4',
  successBorder: '#86efac',
  warning:       '#d97706',
  warningLight:  '#fffbeb',
  border:        '#e2e8f0',
  text:          '#1e293b',
  muted:         '#64748b',
  bg:            '#f1f5f9',
  card:          '#ffffff',
}

export const s = {
  card: {
    background:   c.card,
    borderRadius: 12,
    padding:      28,
    boxShadow:    '0 1px 6px rgba(0,0,0,0.08)',
    border:       `1px solid ${c.border}`,
  },
  cardSm: {
    background:   c.card,
    borderRadius: 10,
    padding:      16,
    boxShadow:    '0 1px 4px rgba(0,0,0,0.06)',
    border:       `1px solid ${c.border}`,
  },
  label:   { display: 'block', fontSize: 13, fontWeight: 500, color: c.muted, marginBottom: 5 },
  input:   { width: '100%', padding: '9px 12px', border: `1px solid ${c.border}`, borderRadius: 8, fontSize: 14, outline: 'none', color: c.text, background: '#fff' },
  group:   { marginBottom: 16 },
  btn: (bg = c.primary, disabled = false) => ({
    width: '100%', padding: '10px', background: disabled ? '#a5b4fc' : bg,
    color: '#fff', border: 'none', borderRadius: 8, fontSize: 14,
    fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
  }),
  btnSm: (bg = c.primary) => ({
    padding: '6px 14px', background: bg, color: '#fff',
    border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer',
  }),
  btnOutline: {
    padding: '6px 14px', background: 'transparent', color: c.muted,
    border: `1px solid ${c.border}`, borderRadius: 6, fontSize: 12, cursor: 'pointer',
  },
  btnGhost: {
    background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px',
    fontSize: 13, color: c.muted, borderRadius: 6,
  },
  error:   { background: c.dangerLight,  border: `1px solid ${c.dangerBorder}`,  color: c.danger,  padding: '10px 14px', borderRadius: 8, fontSize: 13, marginTop: 12 },
  success: { background: c.successLight, border: `1px solid ${c.successBorder}`, color: c.success, padding: '10px 14px', borderRadius: 8, fontSize: 13, marginTop: 12 },
  badge: (role) => ({
    display: 'inline-block', fontSize: 10, fontWeight: 700, padding: '2px 8px',
    borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.05em',
    background: role === 'ADMIN' ? '#fef3c7' : '#ede9fe',
    color:      role === 'ADMIN' ? '#92400e' : c.primary,
  }),
}
