/**
 * Dashboard.jsx — Protected page
 *
 * Shows current user info, create post form, posts list.
 * Delete button only shows for the post's author or an admin.
 */

import { useState }              from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ME, GET_POSTS, CREATE_POST, DELETE_POST } from '../graphql/operations.js'
import { useAuth }               from '../context/AuthContext.jsx'
import { s, c }                  from '../styles/common.js'

export default function Dashboard() {
  const { user }               = useAuth()
  const [form, setForm]        = useState({ title: '', content: '' })
  const [deleteTarget, setDT]  = useState(null)
  const [editTarget, setET]    = useState(null)

  const { data: meData }    = useQuery(ME)
  const { data, loading }   = useQuery(GET_POSTS)

  const [createPost, { loading: creating, error: createErr }] = useMutation(CREATE_POST, {
    refetchQueries: [{ query: GET_POSTS }],
  })
  const [deletePost, { loading: deleting }] = useMutation(DELETE_POST, {
    refetchQueries: [{ query: GET_POSTS }],
  })

  const handleCreate = async e => {
    e.preventDefault()
    try {
      await createPost({ variables: { input: form } })
      setForm({ title: '', content: '' })
    } catch { /* error shown via createErr */ }
  }

  const handleDelete = async () => {
    try {
      await deletePost({ variables: { id: deleteTarget.id } })
      setDT(null)
    } catch (err) {
      alert(err.graphQLErrors?.[0]?.message || err.message)
    }
  }

  const me    = meData?.me
  const posts = data?.posts || []

  const canModify = (post) =>
    post.author.id === user?.id || user?.role === 'ADMIN'

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px' }}>

      {/* User card */}
      {me && (
        <div style={{ ...s.card, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: c.primary, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 700, flexShrink: 0,
          }}>
            {me.name[0].toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: c.text }}>{me.name}</div>
            <div style={{ fontSize: 13, color: c.muted }}>{me.email}</div>
          </div>
          <span style={s.badge(me.role)}>{me.role}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24, alignItems: 'start' }}>

        {/* Create post */}
        <div style={s.card}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: c.text }}>
            New Post
          </h3>
          <form onSubmit={handleCreate}>
            <div style={s.group}>
              <label style={s.label}>Title</label>
              <input style={s.input} value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="Post title" required />
            </div>
            <div style={s.group}>
              <label style={s.label}>Content</label>
              <textarea
                style={{ ...s.input, minHeight: 100, resize: 'vertical' }}
                value={form.content}
                onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                placeholder="Write something…" required
              />
            </div>
            <button style={s.btn(c.primary, creating)} type="submit" disabled={creating}>
              {creating ? 'Publishing…' : 'Publish Post'}
            </button>
          </form>
          {createErr && (
            <div style={s.error}>
              {createErr.graphQLErrors?.[0]?.message || 'Failed to create post'}
            </div>
          )}
        </div>

        {/* Posts list */}
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: c.text }}>
            Posts{' '}
            <span style={{ fontWeight: 400, color: c.muted }}>({posts.length})</span>
          </h3>

          {loading && <p style={{ color: c.muted, fontSize: 13 }}>Loading…</p>}

          {!loading && posts.length === 0 && (
            <div style={{ ...s.cardSm, textAlign: 'center', color: c.muted, padding: 40 }}>
              No posts yet — create the first one!
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {posts.map(post => (
              <div key={post.id} style={s.cardSm}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: c.text, marginBottom: 4 }}>
                      {post.title}
                    </div>
                    <div style={{ fontSize: 13, color: c.muted, marginBottom: 8, lineHeight: 1.5 }}>
                      {post.content}
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>
                      {post.author.name} · {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {canModify(post) && (
                    <button
                      onClick={() => setDT({ id: post.id, title: post.title })}
                      style={{ ...s.btnSm(c.danger), alignSelf: 'flex-start', flexShrink: 0 }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete modal */}
      {deleteTarget && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999,
        }}>
          <div style={{ ...s.card, maxWidth: 380, width: '90%' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>Delete Post</h3>
            <p style={{ fontSize: 14, color: c.muted, marginBottom: 24, lineHeight: 1.5 }}>
              Delete <strong>"{deleteTarget.title}"</strong>? This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button style={s.btnOutline} onClick={() => setDT(null)}>Cancel</button>
              <button style={s.btnSm(c.danger)} onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
