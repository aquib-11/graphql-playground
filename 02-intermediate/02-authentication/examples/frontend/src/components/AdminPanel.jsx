/**
 * AdminPanel.jsx — Admin only page
 *
 * Only accessible when user.role === 'ADMIN'.
 * Shows all users with the ability to delete them.
 */

import { useState }              from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_USERS, DELETE_USER } from '../graphql/operations.js'
import { useAuth }               from '../context/AuthContext.jsx'
import { s, c }                  from '../styles/common.js'

export default function AdminPanel() {
  const { user: currentUser } = useAuth()
  const [deleteTarget, setDT] = useState(null)

  const { data, loading, error } = useQuery(GET_USERS)
  const [deleteUser, { loading: deleting }] = useMutation(DELETE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  })

  const handleDelete = async () => {
    try {
      await deleteUser({ variables: { id: deleteTarget.id } })
      setDT(null)
    } catch (err) {
      alert(err.graphQLErrors?.[0]?.message || err.message)
    }
  }

  if (loading) return <p style={{ padding: 32, color: c.muted }}>Loading users…</p>
  if (error)   return <div style={{ ...s.error, margin: 32 }}>Error: {error.message}</div>

  const users = data?.users || []

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: c.text }}>Admin Panel</h2>
        <p style={{ fontSize: 13, color: c.muted, marginTop: 4 }}>
          {users.length} registered user{users.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {users.map(user => (
          <div key={user.id} style={{ ...s.cardSm, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: user.role === 'ADMIN' ? '#fef3c7' : '#ede9fe',
              color: user.role === 'ADMIN' ? '#92400e' : c.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 700, flexShrink: 0,
            }}>
              {user.name[0].toUpperCase()}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: c.text }}>{user.name}</div>
              <div style={{ fontSize: 12, color: c.muted }}>{user.email}</div>
            </div>

            <span style={s.badge(user.role)}>{user.role}</span>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>
              {new Date(user.createdAt).toLocaleDateString()}
            </span>

            {/* Cannot delete yourself */}
            {user.id !== currentUser?.id && (
              <button
                style={s.btnSm(c.danger)}
                onClick={() => setDT({ id: user.id, name: user.name })}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Delete modal */}
      {deleteTarget && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999,
        }}>
          <div style={{ ...s.card, maxWidth: 380, width: '90%' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>Delete User</h3>
            <p style={{ fontSize: 14, color: c.muted, marginBottom: 8, lineHeight: 1.5 }}>
              Delete <strong>"{deleteTarget.name}"</strong>?
            </p>
            <p style={{ fontSize: 13, color: c.danger, marginBottom: 20 }}>
               All posts by this user will also be deleted.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button style={s.btnOutline} onClick={() => setDT(null)}>Cancel</button>
              <button style={s.btnSm(c.danger)} onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
