/**
 * AuthorList.jsx
 *
 * Demonstrates:
 *   - Nested query (author → books)
 *   - Computed fields (bookCount)
 *   - useQuery with nested data
 */

import { useQuery } from '@apollo/client'
import { GET_AUTHORS } from '../graphql/operations.js'

const s = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 },
  card: { background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid #eee' },
  name: { fontSize: 17, fontWeight: 600, color: '#1a1a2e', marginBottom: 4 },
  bio: { fontSize: 13, color: '#666', lineHeight: 1.6, marginBottom: 12 },
  count: { fontSize: 12, fontWeight: 600, color: '#6c63ff', marginBottom: 10 },
  bookItem: { fontSize: 13, color: '#444', padding: '4px 0', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between' },
  genre: { fontSize: 11, color: '#999', textTransform: 'uppercase' },
  loading: { textAlign: 'center', padding: 60, color: '#999' },
  error: { background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: 16, borderRadius: 8, fontSize: 14 },
}

export default function AuthorList() {
  // Nested query — fetches authors AND each author's books in one request
  const { data, loading, error } = useQuery(GET_AUTHORS)

  if (loading) return <div style={s.loading}>Loading authors...</div>
  if (error)   return <div style={s.error}>Error: {error.message}</div>

  const authors = data?.authors || []

  return (
    <div style={s.grid}>
      {authors.map(author => (
        <div key={author.id} style={s.card}>
          <div style={s.name}>{author.name}</div>
          {author.bio && <div style={s.bio}>{author.bio}</div>}

          {/* bookCount is a computed field — resolved in the backend */}
          <div style={s.count}>
            {author.bookCount} book{author.bookCount !== 1 ? 's' : ''}
          </div>

          {/* author.books comes from the nested query — no extra fetch needed */}
          {author.books.map(book => (
            <div key={book.id} style={s.bookItem}>
              <span>{book.title}</span>
              <span style={s.genre}>{book.genre.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
