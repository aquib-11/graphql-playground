import { useAuth } from '../context/AuthContext.jsx'
import { c, s }    from '../styles/common.js'

export default function Navbar({ page, setPage }) {
  const { user, logout, isLoggedIn } = useAuth()

  const navBtn = (label, target) => (
    <button
      onClick={() => setPage(target)}
      style={{
        ...s.btnGhost,
        color:      page === target ? c.primary : c.muted,
        fontWeight: page === target ? 600 : 400,
      }}
    >
      {label}
    </button>
  )

  return (
    <nav style={{
      background:   c.card,
      borderBottom: `1px solid ${c.border}`,
      padding:      '0 24px',
      height:       56,
      display:      'flex',
      alignItems:   'center',
      justifyContent: 'space-between',
    }}>
      {/* Brand */}
      <span style={{ fontSize: 16, fontWeight: 700, color: c.primary }}>
         GraphQL Auth
      </span>

      {/* Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {isLoggedIn ? (
          <>
            {navBtn('Dashboard', 'dashboard')}
            {user?.role === 'ADMIN' && navBtn('Admin', 'admin')}

            <div style={{ width: 1, height: 20, background: c.border, margin: '0 4px' }} />

            <span style={{ fontSize: 13, color: c.muted }}>{user?.name}</span>
            <span style={s.badge(user?.role)}>{user?.role}</span>

            <button
              onClick={() => { logout(); setPage('login') }}
              style={{ ...s.btnOutline, marginLeft: 4 }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {navBtn('Login', 'login')}
            <button onClick={() => setPage('register')}
              style={{ ...s.btnSm(c.primary) }}>
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
