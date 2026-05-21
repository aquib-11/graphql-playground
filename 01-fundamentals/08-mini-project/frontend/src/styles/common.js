/**
 * common.js — Shared styles used across all components
 */

export const colors = {
  primary:   '#6c63ff',
  primaryHover: '#5b52e0',
  danger:    '#dc2626',
  dangerLight: '#fef2f2',
  dangerBorder: '#fca5a5',
  success:   '#16a34a',
  successLight: '#f0fdf4',
  successBorder: '#86efac',
  border:    '#e5e7eb',
  text:      '#1a1a2e',
  textMuted: '#6b7280',
  bg:        '#f8f9fa',
  card:      '#ffffff',
}

export const s = {
  // Layout
  card: {
    background: colors.card,
    borderRadius: 12,
    padding: 20,
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    border: `1px solid ${colors.border}`,
  },

  // Grid
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
    gap: 16,
  },

  // Typography
  cardTitle: { fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 4 },
  cardMeta:  { fontSize: 13, color: colors.textMuted },
  badge: (color = colors.primary) => ({
    display: 'inline-block',
    fontSize: 11,
    fontWeight: 600,
    color: color,
    background: color + '18',
    borderRadius: 4,
    padding: '2px 8px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  }),

  // Toolbar
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    flexWrap: 'wrap',
  },

  // Form elements
  formGroup: { marginBottom: 16 },
  label: { display: 'block', fontSize: 13, fontWeight: 500, color: colors.textMuted, marginBottom: 5 },
  input: {
    width: '100%',
    padding: '8px 12px',
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
    fontSize: 14,
    outline: 'none',
    color: colors.text,
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
    fontSize: 14,
    background: '#fff',
    color: colors.text,
    cursor: 'pointer',
  },
  textarea: {
    width: '100%',
    padding: '8px 12px',
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
    fontSize: 14,
    minHeight: 80,
    resize: 'vertical',
    color: colors.text,
  },

  // Buttons
  btnPrimary: (loading) => ({
    padding: '9px 18px',
    background: loading ? '#a5b4fc' : colors.primary,
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: loading ? 'not-allowed' : 'pointer',
  }),
  btnSecondary: {
    padding: '7px 14px',
    background: '#fff',
    color: colors.textMuted,
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
    fontSize: 13,
    cursor: 'pointer',
  },
  btnDanger: {
    padding: '7px 14px',
    background: '#fff',
    color: colors.danger,
    border: `1px solid ${colors.dangerBorder}`,
    borderRadius: 8,
    fontSize: 13,
    cursor: 'pointer',
  },
  btnIcon: {
    padding: '5px 10px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 15,
    borderRadius: 6,
  },

  // Feedback
  error: {
    background: colors.dangerLight,
    border: `1px solid ${colors.dangerBorder}`,
    color: colors.danger,
    padding: '10px 14px',
    borderRadius: 8,
    fontSize: 13,
    marginTop: 12,
  },
  success: {
    background: colors.successLight,
    border: `1px solid ${colors.successBorder}`,
    color: colors.success,
    padding: '10px 14px',
    borderRadius: 8,
    fontSize: 13,
    marginTop: 12,
  },

  // States
  loading: { textAlign: 'center', padding: 60, color: colors.textMuted },
  empty:   { textAlign: 'center', padding: 60, color: colors.textMuted },
}
