import { useState }    from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN }       from '../graphql/operations.js'
import { useAuth }     from '../context/AuthContext.jsx'
import { s, c }        from '../styles/common.js'

export default function LoginForm({ onSuccess, onRegister }) {
  const { login }       = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })

  const [doLogin, { loading, error }] = useMutation(LOGIN)

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const { data } = await doLogin({ variables: form })
      login(data.login)
      onSuccess()
    } catch { /* error displayed via Apollo error state */ }
  }

  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ ...s.card, width: '100%', maxWidth: 400 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6,  color: c.text }}>Welcome back</h2>
        <p  style={{ fontSize: 13, color: c.muted, marginBottom: 24 }}>Sign in to your account</p>

        <form onSubmit={handleSubmit}>
          <div style={s.group}>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" name="email"
              value={form.email} onChange={onChange}
              placeholder="you@example.com" required autoComplete="email" />
          </div>
          <div style={s.group}>
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" name="password"
              value={form.password} onChange={onChange}
              placeholder="••••••••" required autoComplete="current-password" />
          </div>
          <button style={s.btn(c.primary, loading)} type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {error && (
          <div style={s.error}>
            {error.graphQLErrors?.[0]?.message || 'Login failed. Please try again.'}
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: 13, color: c.muted, marginTop: 20 }}>
          No account?{' '}
          <button onClick={onRegister}
            style={{ background: 'none', border: 'none', color: c.primary, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
            Create one
          </button>
        </p>
      </div>
    </div>
  )
}
