/**
 * AuthorForm.jsx — Add or Edit an author
 *
 * When `existing` prop is passed → Edit mode (uses UPDATE_AUTHOR mutation)
 * When `existing` is null        → Add mode  (uses ADD_AUTHOR mutation)
 */

import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { ADD_AUTHOR, UPDATE_AUTHOR, GET_AUTHORS } from '../graphql/operations.js'
import { s, colors } from '../styles/common.js'

const EMPTY = { name: '', bio: '' }

export default function AuthorForm({ existing, onDone }) {
  const isEdit = !!existing
  const [form, setForm]      = useState(EMPTY)
  const [successMsg, setMsg] = useState('')

  useEffect(() => {
    if (existing) {
      setForm({ name: existing.name, bio: existing.bio || '' })
    } else {
      setForm(EMPTY)
    }
  }, [existing])

  const [addAuthor,    { loading: adding,   error: addError    }] = useMutation(ADD_AUTHOR, {
    refetchQueries: [{ query: GET_AUTHORS }],
  })
  const [updateAuthor, { loading: updating, error: updateError }] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: GET_AUTHORS }],
  })

  const loading = adding || updating
  const error   = addError || updateError

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setMsg('')
    const input = { name: form.name, bio: form.bio || null }
    try {
      if (isEdit) {
        await updateAuthor({ variables: { id: existing.id, input } })
        setMsg(`"${form.name}" updated successfully!`)
      } else {
        const res = await addAuthor({ variables: { input } })
        setMsg(`"${res.data.addAuthor.name}" added successfully!`)
        setForm(EMPTY)
      }
      setTimeout(() => onDone(), 1200)
    } catch {
      // error state handled by Apollo
    }
  }

  return (
    <div style={{ ...s.card, maxWidth: 500 }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, color: colors.text }}>
        {isEdit ? `Edit — ${existing.name}` : 'Add New Author'}
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={s.formGroup}>
          <label style={s.label}>Name *</label>
          <input style={s.input} name="name" value={form.name}
            onChange={handleChange} placeholder="e.g. Robert C. Martin" required />
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Bio <span style={{ color: '#bbb', fontWeight: 400 }}>(optional)</span></label>
          <textarea style={s.textarea} name="bio" value={form.bio}
            onChange={handleChange} placeholder="A short biography…" />
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button style={s.btnPrimary(loading)} type="submit" disabled={loading}>
            {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Author'}
          </button>
          <button style={s.btnSecondary} type="button" onClick={onDone}>
            Cancel
          </button>
        </div>
      </form>

      {error      && <div style={s.error}>{error.graphQLErrors?.[0]?.message || error.message}</div>}
      {successMsg && <div style={s.success}>{successMsg}</div>}
    </div>
  )
}
