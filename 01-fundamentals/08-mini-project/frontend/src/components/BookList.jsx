/**
 * BookList.jsx
 *
 * Demonstrates:
 *   - useQuery hook to fetch data
 *   - Variables for filtering (genre)
 *   - useMutation hook for delete
 *   - Loading and error states
 *   - Refetching after mutation
 */

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_BOOKS, DELETE_BOOK } from '../graphql/operations.js'

const GENRES = ['', 'FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'TECHNOLOGY']

const s = {
  toolbar: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 },
  label: { fontSize: 13, color: '#666' },
  select: { padding: '6px 10px', borderRadius: 6, border: '1px solid #ddd', fontSize: 13, cursor: 'pointer' },
  count: { fontSize: 13, color: '#999', marginLeft: 'auto' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 },
  card: { background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid #eee' },
  genre: { fontSize: 11, fontWeight: 600, color: '#6c63ff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 },
  title: { fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 4 },
  author: { fontSize: 13, color: '#555', marginBottom: 4 },
  meta: { fontSize: 12, color: '#999', marginBottom: 12 },
  isbn: { fontSize: 11, color: '#bbb', fontFamily: 'monospace' },
  deleteBtn: { marginTop: 12, padding: '6px 12px', background: '#fff', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: 6, cursor: 'pointer', fontSize: 12, width: '100%' },
  loading: { textAlign: 'center', padding: 60, color: '#999' },
  error: { background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: 16, borderRadius: 8, fontSize: 14 },
  empty: { textAlign: 'center', padding: 60, color: '#999' },
}

export default function BookList() {
  const [genre, setGenre] = useState('')

  // useQuery — fetches books from the GraphQL server
  // Re-runs automatically when `genre` variable changes
  const { data, loading, error } = useQuery(GET_BOOKS, {
    variables: genre ? { genre } : {},
  })

  // useMutation — runs the DELETE_BOOK mutation
  // refetchQueries tells Apollo to re-run GET_BOOKS after deleting
  const [deleteBook] = useMutation(DELETE_BOOK, {
    refetchQueries: [{ query: GET_BOOKS, variables: genre ? { genre } : {} }],
  })

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return
    try {
      await deleteBook({ variables: { id } })
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  if (loading) return <div style={s.loading}>Loading books...</div>
  if (error)   return <div style={s.error}>Error: {error.message}</div>

  const books = data?.books || []

  return (
    <div>
      {/* Genre filter toolbar */}
      <div style={s.toolbar}>
        <span style={s.label}>Filter by genre:</span>
        <select
          style={s.select}
          value={genre}
          onChange={e => setGenre(e.target.value)}
        >
          {GENRES.map(g => (
            <option key={g} value={g}>{g || 'All genres'}</option>
          ))}
        </select>
        <span style={s.count}>{books.length} book{books.length !== 1 ? 's' : ''}</span>
      </div>

      {books.length === 0 ? (
        <div style={s.empty}>No books found{genre ? ` in ${genre}` : ''}.</div>
      ) : (
        <div style={s.grid}>
          {books.map(book => (
            <div key={book.id} style={s.card}>
              <div style={s.genre}>{book.genre.replace('_', ' ')}</div>
              <div style={s.title}>{book.title}</div>
              <div style={s.author}>by {book.author.name}</div>
              <div style={s.meta}>{book.year}</div>
              <div style={s.isbn}>{book.isbn}</div>
              <button
                style={s.deleteBtn}
                onClick={() => handleDelete(book.id, book.title)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
