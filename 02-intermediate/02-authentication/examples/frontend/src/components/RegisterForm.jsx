import { useState }    from 'react'
import { useMutation } from '@apollo/client'
import { REGISTER }    from '../graphql/operations.js'
import { useAuth }     from '../context/AuthContext.jsx'
import { s, c }        from '../styles/common.js'

export default function RegisterForm({ onSuccess, onLogin }) {
  const { login }       = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [clientError, setClientError] = useState('')

  const [doRegister, { loading, error }] = useMutation(REGISTER)

  const handleSubmit = async e => {
    e.preventDefault()
    setClientError('')

    if (form.password !== form.confirm) {
      setClientError('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      setClientError('Password must be at least 6 characters')
      return
    }

    try {
      const { data } = await doRegister({
        variables: {
          input: { name: form.name, email: form.email, password: form.password },
        },
      })
      login(data.register)
      onSuccess()
    } catch { /* error displayed via Apollo error state */ }
  }

  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const displayError = clientError || error?.graphQLErrors?.[0]?.message

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ ...s.card, width: '100%', maxWidth: 420 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6,  color: c.text }}>Create account</h2>
        <p  style={{ fontSize: 13, color: c.muted, marginBottom: 24 }}>Start using the API today</p>

        <form onSubmit={handleSubmit}>
          <div style={s.group}>
            <label style={s.label}>Full name</label>
            <input style={s.input} name="name" value={form.name} onChange={onChange}
              placeholder="Your name" required autoComplete="name" />
          </div>
          <div style={s.group}>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" name="email" value={form.email} onChange={onChange}
              placeholder="you@example.com" required autoComplete="email" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={s.group}>
              <label style={s.label}>Password</label>
              <input style={s.input} type="password" name="password" value={form.password} onChange={onChange}
                placeholder="Min. 6 chars" required autoComplete="new-password" />
            </div>
            <div style={s.group}>
              <label style={s.label}>Confirm</label>
              <input style={s.input} type="password" name="confirm" value={form.confirm} onChange={onChange}
                placeholder="Repeat" required autoComplete="new-password" />
            </div>
          </div>
          <button style={s.btn(c.primary, loading)} type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        {displayError && <div style={s.error}>{displayError}</div>}

        <p style={{ textAlign: 'center', fontSize: 13, color: c.muted, marginTop: 20 }}>
          Already have an account?{' '}
          <button onClick={onLogin}
            style={{ background: 'none', border: 'none', color: c.primary, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}
