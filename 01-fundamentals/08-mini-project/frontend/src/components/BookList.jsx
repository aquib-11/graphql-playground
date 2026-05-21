/**
 * BookList.jsx — List all books with genre filter, edit, delete
 *
 * Hooks used: useQuery, useMutation
 */

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_BOOKS, DELETE_BOOK } from "../graphql/operations.js";
import { s, colors } from "../styles/common.js";

const GENRES = [
  "",
  "FICTION",
  "NON_FICTION",
  "SCIENCE",
  "HISTORY",
  "BIOGRAPHY",
  "TECHNOLOGY",
];

export default function BookList({ onEdit }) {
  const [genre, setGenre] = useState("");

  const { data, loading, error } = useQuery(GET_BOOKS, {
    variables: genre ? { genre } : {},
  });

  const [deleteBook, { loading: deleting }] = useMutation(DELETE_BOOK, {
    refetchQueries: [{ query: GET_BOOKS, variables: genre ? { genre } : {} }],
  });

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteBook({ variables: { id } });
    } catch (err) {
      alert(err.graphQLErrors?.[0]?.message || err.message);
    }
  };

  if (loading) return <div style={s.loading}>Loading books…</div>;
  if (error) return <div style={s.error}>Error: {error.message}</div>;

  const books = data?.books || [];

  return (
    <div>
      {/* Toolbar */}
      <div style={s.toolbar}>
        <span style={{ fontSize: 13, color: colors.textMuted }}>Filter:</span>
        <select
          style={{ ...s.select, width: "auto" }}
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g || "All genres"}
            </option>
          ))}
        </select>
        <span
          style={{ fontSize: 13, color: colors.textMuted, marginLeft: "auto" }}
        >
          {books.length} book{books.length !== 1 ? "s" : ""}
        </span>
      </div>

      {books.length === 0 ? (
        <div style={s.empty}>
          No books found{genre ? ` in ${genre.replace("_", " ")}` : ""}.
        </div>
      ) : (
        <div style={s.grid}>
          {books.map((book) => (
            <div key={book.id} style={s.card}>
              {/* Genre badge */}
              <div style={{ marginBottom: 8 }}>
                <span style={s.badge()}>{book.genre.replace("_", " ")}</span>
              </div>

              {/* Title & author */}
              <div style={s.cardTitle}>{book.title}</div>
              <div style={{ ...s.cardMeta, marginBottom: 4 }}>
                by {book.author.name}
              </div>
              <div style={{ ...s.cardMeta, marginBottom: 12 }}>{book.year}</div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 11,
                  color: "#bbb",
                  marginBottom: 16,
                }}
              >
                {book.isbn}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  style={{ ...s.btnSecondary, flex: 1 }}
                  onClick={() => onEdit(book)}
                >
                  ✏️ Edit
                </button>
                <button
                  style={{ ...s.btnDanger, flex: 1 }}
                  onClick={() => handleDelete(book.id, book.title)}
                  disabled={deleting}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
