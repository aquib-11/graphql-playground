/**
 * App.jsx — Main application
 *
 * Simple tab navigation between:
 *   - Books list (with genre filter)
 *   - Add book form
 *   - Authors list
 */

import { useState } from 'react'
import BookList from './components/BookList.jsx'
import AddBook from './components/AddBook.jsx'
import AuthorList from './components/AuthorList.jsx'
import AddAuthor from './components/AddAuthor.jsx'

const styles = {
  app: { maxWidth: 900, margin: '0 auto', padding: '24px 16px' },
  header: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: 700, color: '#1a1a2e' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  tabs: { display: 'flex', gap: 4, marginBottom: 24, borderBottom: '2px solid #eee', paddingBottom: 0 },
  tab: (active) => ({
    padding: '10px 20px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: active ? 600 : 400,
    color: active ? '#6c63ff' : '#666',
    borderBottom: active ? '2px solid #6c63ff' : '2px solid transparent',
    marginBottom: -2,
    transition: 'all 0.15s',
  }),
}

export default function App() {
  const [activeTab, setActiveTab] = useState('books')

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.title}>📚 Book Library</h1>
        <p style={styles.subtitle}>
          GraphQL Mini Project — React + Apollo Client + Apollo Server
        </p>
      </header>

      <nav style={styles.tabs}>
        <button
          style={styles.tab(activeTab === "books")}
          onClick={() => setActiveTab("books")}
        >
          All Books
        </button>
        <button
          style={styles.tab(activeTab === "add-book")}
          onClick={() => setActiveTab("add-book")}
        >
          + Add Book
        </button>
        <button
          style={styles.tab(activeTab === "authors")}
          onClick={() => setActiveTab("authors")}
        >
          Authors
        </button>
        <button
          style={styles.tab(activeTab === "add-author")}
          onClick={() => setActiveTab("add-author")}
        >
          + Add Author
        </button>
      </nav>

      {activeTab === "books" && <BookList />}
      {activeTab === "add-book" && (
        <AddBook onAdded={() => setActiveTab("books")} />
      )}
      {activeTab === "authors" && <AuthorList />}
      {activeTab === "add-author" && <AddAuthor onAdded={()=>{setActiveTab("authors")}}/>}
    </div>
  );
}
