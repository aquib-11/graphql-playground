/**
 * App.jsx — Main app with tab navigation
 * Tabs: Books | Add Book | Authors | Add Author
 */

import { useState } from "react";
import BookList from "./components/BookList.jsx";
import BookForm from "./components/BookForm.jsx";
import AuthorList from "./components/AuthorList.jsx";
import AuthorForm from "./components/AuthorForm.jsx";
import { colors } from "./styles/common.js";


export default function App() {
  const [activeTab, setActiveTab] = useState("books");
  // editTarget = { type: 'book'|'author', data: {...} }
  const [editTarget, setEditTarget] = useState(null);

   const tabs = [
     { id: "books", label: "📚 Books" },
     {
       id: "add-book",
       label: editTarget?.type === "book" ? "✏️ Edit Book" : "+ Add Book",
     },
     { id: "authors", label: "✍️ Authors" },
     {
       id: "add-author",
       label: editTarget?.type === "author" ? "✏️ Edit Author" : "+ Add Author",
     },
   ];

  const openEditBook = (book) => {
    setEditTarget({ type: "book", data: book });
    setActiveTab("add-book");
  };

  const openEditAuthor = (author) => {
    setEditTarget({ type: "author", data: author });
    setActiveTab("add-author");
  };

  const handleDone = (tab = "books") => {
    setEditTarget(null);
    setActiveTab(tab);
  };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 16px" }}>
      {/* Header */}
      <header style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: colors.text }}>
          📚 Book Library
        </h1>
        <p style={{ fontSize: 13, color: colors.textMuted, marginTop: 4 }}>
          GraphQL Mini Project — Apollo Server v5 · React · Apollo Client
        </p>
      </header>

      {/* Tabs */}
      <nav
        style={{
          display: "flex",
          gap: 2,
          marginBottom: 24,
          borderBottom: `2px solid #eee`,
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setEditTarget(null);
              setActiveTab(tab.id);
            }}
            style={{
              padding: "9px 18px",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? colors.primary : colors.textMuted,
              borderBottom:
                activeTab === tab.id
                  ? `2px solid ${colors.primary}`
                  : "2px solid transparent",
              marginBottom: -2,
              whiteSpace: "nowrap",
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      {activeTab === "books" && <BookList onEdit={openEditBook} />}
      {activeTab === "add-book" && (
        <BookForm
          existing={editTarget?.type === "book" ? editTarget.data : null}
          onDone={() => handleDone("books")}
        />
      )}
      {activeTab === "authors" && <AuthorList onEdit={openEditAuthor} />}
      {activeTab === "add-author" && (
        <AuthorForm
          existing={editTarget?.type === "author" ? editTarget.data : null}
          onDone={() => handleDone("authors")}
        />
      )}
    </div>
  );
}
