/**
 * AddBook.jsx
 *
 * Demonstrates:
 *   - useMutation hook
 *   - Passing variables from a form
 *   - Loading state during mutation
 *   - Error display from GraphQL errors
 *   - Refetching after successful mutation
 */

import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { ADD_BOOK, GET_BOOKS, GET_AUTHORS } from '../graphql/operations.js'

const GENRES = ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'TECHNOLOGY']

const s = {
  card: { background: '#fff', borderRadius: 10, padding: 28, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', maxWidth: 480 },
  title: { fontSize: 18, fontWeight: 600, marginBottom: 20, color: '#1a1a2e' },
  group: { marginBottom: 16 },
  label: { display: 'block', fontSize: 13, fontWeight: 500, color: '#555', marginBottom: 5 },
  input: { width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, outline: 'none' },
  select: { width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, background: '#fff' },
  btn: (loading) => ({
    width: '100%', padding: '10px', background: loading ? '#a5b4fc' : '#6c63ff',
    color: '#fff', border: 'none', borderRadius: 6, fontSize: 14,
    fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8,
  }),
  error: { background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: 12, borderRadius: 6, fontSize: 13, marginTop: 12 },
  success: { background: '#f0fdf4', border: '1px solid #86efac', color: '#16a34a', padding: 12, borderRadius: 6, fontSize: 13, marginTop: 12 },
}

const EMPTY_FORM = { title: '', isbn: '', genre: 'FICTION', year: new Date().getFullYear(), authorId: '' }

export default function AddBook({ onAdded }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [successMsg, setSuccessMsg] = useState('')

  // Fetch authors so the user can pick from a dropdown
  const { data: authorsData } = useQuery(GET_AUTHORS)
  const authors = authorsData?.authors || []

  // useMutation — second item is an object with loading/error state
  const [addBook, { loading, error }] = useMutation(ADD_BOOK, {
    // After adding, re-fetch the books list so it shows the new book
    refetchQueries: [{ query: GET_BOOKS }],
  })

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessMsg('')
    try {
      const result = await addBook({
        variables: {
          input: {
            title: form.title,
            isbn: form.isbn,
            genre: form.genre,
            year: parseInt(form.year),
            authorId: form.authorId,
          },
        },
      })
      setSuccessMsg(`"${result.data.addBook.title}" added successfully!`)
      setForm(EMPTY_FORM)
      setTimeout(() => onAdded(), 1500) // Go back to book list after 1.5s
    } catch {
      // Error is already in the `error` variable from useMutation
    }
  }

  return (
    <div style={s.card}>
      <h2 style={s.title}>Add New Book</h2>

      <form onSubmit={handleSubmit}>
        <div style={s.group}>
          <label style={s.label}>Title *</label>
          <input style={s.input} name="title" value={form.title}
            onChange={handleChange} placeholder="e.g. The Pragmatic Programmer" required />
        </div>

        <div style={s.group}>
          <label style={s.label}>ISBN *</label>
          <input style={s.input} name="isbn" value={form.isbn}
            onChange={handleChange} placeholder="e.g. 978-0201633610" required />
        </div>

        <div style={s.group}>
          <label style={s.label}>Genre *</label>
          <select style={s.select} name="genre" value={form.genre} onChange={handleChange}>
            {GENRES.map(g => <option key={g} value={g}>{g.replace('_', ' ')}</option>)}
          </select>
        </div>

        <div style={s.group}>
          <label style={s.label}>Year *</label>
          <input style={s.input} name="year" type="number"
            value={form.year} onChange={handleChange} min="1000" max="2099" required />
        </div>

        <div style={s.group}>
          <label style={s.label}>Author *</label>
          <select style={s.select} name="authorId" value={form.authorId} onChange={handleChange} required>
            <option value="">Select an author...</option>
            {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>

        <button style={s.btn(loading)} type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Book'}
        </button>
      </form>

      {/* Show GraphQL error message */}
      {error && (
        <div style={s.error}>
          {error.graphQLErrors?.[0]?.message || error.message}
        </div>
      )}

      {/* Show success message */}
      {successMsg && <div style={s.success}>{successMsg}</div>}
    </div>
  )
}
