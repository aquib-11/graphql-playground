/**
 * BookForm.jsx — Add or Edit a book
 *
 * When `existing` prop is passed → Edit mode (uses UPDATE_BOOK mutation)
 * When `existing` is null        → Add mode  (uses ADD_BOOK mutation)
 */

import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { ADD_BOOK, UPDATE_BOOK, GET_BOOKS, GET_AUTHORS } from '../graphql/operations.js'
import { s, colors } from '../styles/common.js'

const GENRES = ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'TECHNOLOGY']
const EMPTY  = { title: '', isbn: '', genre: 'FICTION', year: new Date().getFullYear(), authorId: '' }

export default function BookForm({ existing, onDone }) {
  const isEdit = !!existing
  const [form, setForm]       = useState(EMPTY)
  const [successMsg, setMsg]  = useState('')

  // Pre-fill form when editing
  useEffect(() => {
    if (existing) {
      setForm({
        title:    existing.title,
        isbn:     existing.isbn,
        genre:    existing.genre,
        year:     existing.year,
        authorId: existing.author.id,
      })
    } else {
      setForm(EMPTY)
    }
  }, [existing])

  const { data: authorsData } = useQuery(GET_AUTHORS)
  const authors = authorsData?.authors || []

  const [addBook,    { loading: adding,   error: addError   }] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
  })
  const [updateBook, { loading: updating, error: updateError }] = useMutation(UPDATE_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
  })

  const loading = adding || updating
  const error   = addError || updateError

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setMsg('')
    try {
      const input = { ...form, year: parseInt(form.year) }

      if (isEdit) {
        await updateBook({ variables: { id: existing.id, input } })
        setMsg(`"${form.title}" updated successfully!`)
      } else {
        const res = await addBook({ variables: { input } })
        setMsg(`"${res.data.addBook.title}" added successfully!`)
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
        {isEdit ? `Edit — ${existing.title}` : 'Add New Book'}
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={s.formGroup}>
          <label style={s.label}>Title *</label>
          <input style={s.input} name="title" value={form.title}
            onChange={handleChange} placeholder="e.g. The Pragmatic Programmer" required />
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>ISBN *</label>
          <input style={s.input} name="isbn" value={form.isbn}
            onChange={handleChange} placeholder="e.g. 978-0201633610" required />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={s.formGroup}>
            <label style={s.label}>Genre *</label>
            <select style={s.select} name="genre" value={form.genre} onChange={handleChange}>
              {GENRES.map(g => <option key={g} value={g}>{g.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Year *</label>
            <input style={s.input} name="year" type="number"
              value={form.year} onChange={handleChange} min="1000" max="2099" required />
          </div>
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Author *</label>
          <select style={s.select} name="authorId" value={form.authorId} onChange={handleChange} required>
            <option value="">Select an author…</option>
            {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button style={s.btnPrimary(loading)} type="submit" disabled={loading}>
            {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Book'}
          </button>
          <button style={s.btnSecondary} type="button" onClick={onDone}>
            Cancel
          </button>
        </div>
      </form>

      {error    && <div style={s.error}>{error.graphQLErrors?.[0]?.message || error.message}</div>}
      {successMsg && <div style={s.success}>{successMsg}</div>}
    </div>
  )
}
