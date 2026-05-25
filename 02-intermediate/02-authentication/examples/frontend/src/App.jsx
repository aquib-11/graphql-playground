import { useState, useEffect } from 'react'
import { useAuth }    from './context/AuthContext.jsx'
import Navbar         from './components/Navbar.jsx'
import LoginForm      from './components/LoginForm.jsx'
import RegisterForm   from './components/RegisterForm.jsx'
import Dashboard      from './components/Dashboard.jsx'
import AdminPanel     from './components/AdminPanel.jsx'

export default function App() {
  const { isLoggedIn, user } = useAuth()
  const [page, setPage]      = useState('login')

  // Redirect based on auth state
  useEffect(() => {
    if (isLoggedIn) setPage('dashboard')
    else            setPage('login')
  }, [isLoggedIn])

  const goTo = (p) => {
    // Guard admin page
    if (p === 'admin' && user?.role !== 'ADMIN') return
    setPage(p)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9' }}>
      <Navbar page={page} setPage={goTo} />

      {!isLoggedIn && page === 'login'    && <LoginForm    onSuccess={() => goTo('dashboard')} onRegister={() => goTo('register')} />}
      {!isLoggedIn && page === 'register' && <RegisterForm onSuccess={() => goTo('dashboard')} onLogin={() => goTo('login')} />}
      {isLoggedIn  && page === 'dashboard'&& <Dashboard />}
      {isLoggedIn  && page === 'admin'    && user?.role === 'ADMIN' && <AdminPanel />}

      {/* Fallback — unauthenticated user trying to access protected page */}
      {!isLoggedIn && page !== 'login' && page !== 'register' && (
        <LoginForm onSuccess={() => goTo('dashboard')} onRegister={() => goTo('register')} />
      )}
    </div>
  )
}
